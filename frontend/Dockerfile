# Stage 1: Build environment (slim Node.js image)
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .
RUN npm run build
# Copy the rest of your application code

# Stage 2: Production environment (smaller Alpine image)
EXPOSE 3000

# Start the Next.js application in production mode
CMD npm start