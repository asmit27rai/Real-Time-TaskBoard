package db

import (
    "context"
    "encoding/json"
    "log"

    "github.com/asmit27rai/TaskSpark/backend/internal/models"
    "github.com/asmit27rai/TaskSpark/backend/internal/ws"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// ChangeEvent represents a MongoDB change stream event for tasks
type ChangeEvent struct {
    OperationType string       `bson:"operationType" json:"type"`
    FullDocument  models.Task  `bson:"fullDocument" json:"task"`
}

// WatchTasks listens to the "tasks" collection and broadcasts changes
func WatchTasks(ctx context.Context, client *mongo.Client, hub *ws.Hub) {
    coll := client.Database("taskdb").Collection("tasks")
    stream, err := coll.Watch(ctx, mongo.Pipeline{}, options.ChangeStream())
    if err != nil {
        log.Println("Change stream error:", err)
        return
    }
    defer stream.Close(ctx)

    for stream.Next(ctx) {
        var event ChangeEvent
        if err := stream.Decode(&event); err != nil {
            log.Println("Decode error:", err)
            continue
        }
        data, err := json.Marshal(event)
        if err != nil {
            log.Println("Marshal error:", err)
            continue
        }
        hub.Broadcast <- data
    }
    if err := stream.Err(); err != nil {
        log.Println("Stream error:", err)
    }
}