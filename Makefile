.PHONY: dev install build clean help

# Default target
dev:
	@echo "Starting both client and server..."
	@trap 'kill 0' EXIT; \
	cd client && npm run dev & \
	cd server && npm start & \
	wait

# Install dependencies for both client and server
install:
	@echo "Installing client dependencies..."
	@cd client && npm install
	@echo "Installing server dependencies..."
	@cd server && npm install

# Build both client and server
build:
	@echo "Building client..."
	@cd client && npm run build
	@echo "Server build not needed (TypeScript)"

# Clean node_modules and build artifacts
clean:
	@echo "Cleaning client..."
	@cd client && rm -rf node_modules .next
	@echo "Cleaning server..."
	@cd server && rm -rf node_modules

# Start only the client
client:
	@echo "Starting client only..."
	@cd client && npm run dev

# Start only the server
server:
	@echo "Starting server only..."
	@cd server && npm start

# Show help
help:
	@echo "Available commands:"
	@echo "  dev      - Install dependencies and start both client and server"
	@echo "  install  - Install dependencies for both client and server"
	@echo "  build    - Build both client and server"
	@echo "  clean    - Remove node_modules and build artifacts"
	@echo "  client   - Start only the client"
	@echo "  server   - Start only the server"
	@echo "  help     - Show this help message"
