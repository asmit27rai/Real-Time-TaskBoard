package api

import (
    "context"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"

    "github.com/asmit27rai/real-time-taskboard/backend/internal/models"
    "github.com/asmit27rai/real-time-taskboard/backend/internal/ws"
)

// TaskHandler holds DB collection and WS hub
type TaskHandler struct {
    Collection *mongo.Collection
    Hub        *ws.Hub
}

// NewTaskHandler constructs a TaskHandler
func NewTaskHandler(db *mongo.Database, hub *ws.Hub) *TaskHandler {
    return &TaskHandler{Collection: db.Collection("tasks"), Hub: hub}
}

// GetTasks returns all tasks
func (h *TaskHandler) GetTasks(c *gin.Context) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    cursor, err := h.Collection.Find(ctx, bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var tasks []models.Task
    if err := cursor.All(ctx, &tasks); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, tasks)
}

// CreateTask inserts a new task
func (h *TaskHandler) CreateTask(c *gin.Context) {
    var task models.Task
    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    task.ID = primitive.NewObjectID()
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if _, err := h.Collection.InsertOne(ctx, task); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, task)
}

// UpdateTask modifies an existing task
func (h *TaskHandler) UpdateTask(c *gin.Context) {
    id := c.Param("id")
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }
    var task models.Task
    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    update := bson.M{"$set": bson.M{"title": task.Title, "description": task.Description, "completed": task.Completed}}
    if _, err := h.Collection.UpdateByID(ctx, oid, update); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    task.ID = oid
    c.JSON(http.StatusOK, task)
}

// DeleteTask removes a task
func (h *TaskHandler) DeleteTask(c *gin.Context) {
    id := c.Param("id")
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if _, err := h.Collection.DeleteOne(ctx, bson.M{"_id": oid}); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusNoContent)
}