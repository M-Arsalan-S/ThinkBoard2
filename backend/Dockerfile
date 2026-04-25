# Use official Node.js 20 image (Alpine for small footprint)
FROM node:20-alpine

# Use /app as the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
