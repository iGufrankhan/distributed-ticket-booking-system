FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy rest of the code
COPY . .

# Expose API port
EXPOSE 5000

# Default command (API)
CMD ["npm", "start"]
