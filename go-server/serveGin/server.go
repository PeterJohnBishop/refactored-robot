package serveGin

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/subosito/gotenv"
)

func Init() {

	err := gotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file:", err)
	}
	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "8081"
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	WebSocketRoutes(r)

	fmt.Printf("Gin server listening on http://localhost:%s/\n", port)
	err = r.Run(fmt.Sprintf(":%s", port))
	if err != nil {
		log.Println("Failed to start server:", err)
	}
}
