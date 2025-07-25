# refactored-robot

# Node
Launches the websocket server, then awaits connection before initializing the websocket conenction, Apollo GraphQL API server, and REST API server, and MongoDB connection.

## Apollo GraphQL Server
GraphQL API handles user JSON Web Token authentication, storing user records in a MongoDB collection using Mongoose object data modeling.

## Express Server
Provides REST API for user authentication and CRUD operations.

# Gin
Initializes the websocket server. 

## Gin Websocket Server
Handles websocket API to provide frontend to backend, and server to server communication.


http://localhost/api-go/	Go REST API
ws://localhost/ws/	Go WebSocket Server
http://localhost/api/	Node REST API
http://localhost/graphql/	Apollo GraphQL Server
