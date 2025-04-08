package ws

import (
    "github.com/gin-gonic/gin"
)

// ServeWs upgrades HTTP to WS and registers the client
func ServeWs(hub *Hub) gin.HandlerFunc {
    return func(c *gin.Context) {
        conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
        if err != nil {
            return
        }
        client := &Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
        hub.Register <- client
        go client.WritePump()
        go client.ReadPump()
    }
}