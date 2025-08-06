from flask import Flask, request, jsonify
from moviepy.editor import VideoFileClip, AudioFileClip
import os
import requests
import uuid

app = Flask(__name__)

@app.route("/", methods=["POST"])
def merge_video_audio():
    try:
        data = request.get_json()
        video_url = data["video_url"]
        audio_url = data["audio_url"]

        video_path = f"/tmp/video_{uuid.uuid4()}.mp4"
        audio_path = f"/tmp/audio_{uuid.uuid4()}.mp3"
        output_path = f"/tmp/merged_{uuid.uuid4()}.mp4"

        with open(video_path, "wb") as f:
            f.write(requests.get(video_url).content)

        with open(audio_path, "wb") as f:
            f.write(requests.get(audio_url).content)

        video_clip = VideoFileClip(video_path)
        audio_clip = AudioFileClip(audio_path)

        final_clip = video_clip.set_audio(audio_clip)
        final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

        return jsonify({"status": "success", "output_path": output_path})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
