# Use a minimal Go image
FROM golang:1.23-alpine

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire backend directory into the container
COPY . .

# Build the Go binary
RUN go build -o main ./cmd/server

# Expose the port your server runs on
EXPOSE 8080

# Set environment file if needed
# You can use this if you want to load environment variables manually:
COPY . .

# Run the binary
CMD ["./main"]
