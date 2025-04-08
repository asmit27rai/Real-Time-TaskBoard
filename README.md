# Real-Time Task Board Backend

This repository contains the Go backend for a real-time task board application using MongoDB Change Streams and WebSockets. Follow the steps below to set up and run the server locally.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Clone the Repository](#clone-the-repository)  
3. [Environment Variables](#environment-variables)  
4. [Install Dependencies](#install-dependencies)  
5. [Run the Server](#run-the-server)  
6. [API Endpoints](#api-endpoints)  

---

## Prerequisites

- Go 1.18 or higher installed and on your `$PATH`.  
- MongoDB running locally on `mongodb://localhost:27017` or a remote MongoDB URI.  

---

## Clone the Repository

```bash
# From your workspace directory
git clone https://github.com/asmit27rai/real-time-taskboard.git
cd real-time-taskboard/backend
```

## Environment Variables

### Create a .env file in the backend/ folder or export the variables directly in your shell.

```bash
# .env file (optional)
MONGO_URI=mongodb://localhost:27017
PORT=8080

# Or export in shell
export MONGO_URI="mongodb://localhost:27017"
export PORT=8080      # Defaults to 8080 if unset
```

## Install Dependencies

```bash
# Ensure you are in the backend/ directory
cd real-time-taskboard/backend

# Initialize Go modules (if not done)
go mod init github.com/asmit27rai/real-time-taskboard/backend

# Download dependencies
go mod tidy
```

## Run the Server

```bash
# Run the server directly
go run ./cmd/server
```

## API Endpoints

| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| GET    | `/tasks`     | List all tasks          |
| POST   | `/tasks`     | Create a new task       |
| PUT    | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task           |
| GET    | `/ws`        | WebSocket endpoint      |
