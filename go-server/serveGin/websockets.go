package serveGin

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WSEvents struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow any origin (for dev)
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)

var broadcast = make(chan WSEvents)

const (
	pingPeriod = 30 * time.Second
	pongWait   = 60 * time.Second
	writeWait  = 10 * time.Second
)

func handleWebSocket(c *gin.Context) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer ws.Close()

	clients[ws] = true
	log.Println("Client connected:", ws.RemoteAddr())

	ws.SetReadLimit(512)
	ws.SetReadDeadline(time.Now().Add(pongWait))
	ws.SetPongHandler(func(string) error {
		ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	go pingClient(ws) // <- start pinging in the background

	for {
		var event WSEvents
		err := ws.ReadJSON(&event)
		if err != nil {
			log.Println("WebSocket read error:", err)
			delete(clients, ws)
			break
		}
		broadcast <- event
	}
}

func pingClient(ws *websocket.Conn) {
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()

	for range ticker.C {
		ws.SetWriteDeadline(time.Now().Add(writeWait))
		if err := ws.WriteMessage(websocket.PingMessage, nil); err != nil {
			log.Println("Ping failed, closing connection:", err)
			ws.Close()
			break
		}
	}
}

func HandleMessages() {
	log.Println("WebSocket ready for messages")
	for {
		event := <-broadcast

		switch event.Event {
		case "message":
			broadcastMessage(event)
		case "connect":
			handleConnection(event)
		case "disconnect":
			handleDisconnection(event)
		default:
			log.Printf("Unhandled event type: %s\n", event.Event)
		}
	}
}

func broadcastMessage(event WSEvents) {
	for client := range clients {
		log.Printf("message: %s\n", event.Data)
		event.Data = "Message sent." // Ensure data is set for each client
		err := client.WriteJSON(event)
		if err != nil {
			log.Println("WebSocket write error:", err)
			client.Close()
			delete(clients, client)
		}
	}
}

func handleConnection(event WSEvents) {
	log.Printf("%s connected.\n", event.Data)
}

func handleDisconnection(event WSEvents) {
	log.Printf("%s disconnected.\n", event.Data)
}

func WebSocketRoutes(r *gin.Engine) {
	r.GET("/ws", func(c *gin.Context) {
		handleWebSocket(c)
	})
}
