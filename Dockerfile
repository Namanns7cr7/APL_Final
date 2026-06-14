# Stage 1: Build the React app using Vite
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build


# Stage 2: Setup a lightweight Node.js server to serve the production build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install serve globally to serve the static files
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]
