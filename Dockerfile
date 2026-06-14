# Use official Node.js 18 image as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the React app using Vite
RUN npm run build

# Use a lightweight Node.js server to serve the static files
FROM node:18-alpine AS serve

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist

# Expose port 5000
EXPOSE 5000

# Serve the static files from /dist directory
CMD ["serve", "-s", "dist", "-l", "5000"]
