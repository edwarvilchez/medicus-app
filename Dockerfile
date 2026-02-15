FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy server package files (cache bust: 2026-02-15-v2)
COPY server/package*.json ./

# Install dependencies
RUN rm -f package-lock.json && \
    npm install --only=production && \
    npm cache clean --force

# Copy server source
COPY server/ ./

# Create uploads directory with correct permissions
RUN mkdir -p uploads && \
    chown -R node:node /usr/src/app

# Switch to non-root user for security
USER node

# Environment variables
ENV NODE_ENV=production \
    PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
