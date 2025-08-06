const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// POST route to handle merging
app.post('/merge', upload.fields([{ name: 'video' }, { name: 'audio' }]), (req, res) => {
  const videoFile = req.files['video'][0];
  const audioFile = req.files['audio'][0];

  const outputFileName = `merged_${Date.now()}.mp4`;
  const outputPath = path.join('merged', outputFileName);

  // Make sure merged directory exists
  fs.mkdirSync('merged', { recursive: true });

  ffmpeg()
    .input(videoFile.path)
    .input(audioFile.path)
    .outputOptions('-c:v copy') // Keep original video codec
    .outputOptions('-c:a aac')  // Convert audio to AAC
    .on('end', () => {
      // Send the merged file
      res.sendFile(path.resolve(outputPath), () => {
        // Cleanup temp files
        fs.unlinkSync(videoFile.path);
        fs.unlinkSync(audioFile.path);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err);
      res.status(500).send('Merging failed');
    })
    .save(outputPath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
