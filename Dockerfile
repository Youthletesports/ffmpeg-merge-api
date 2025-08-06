FROM node:18-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Expose port (optional)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
