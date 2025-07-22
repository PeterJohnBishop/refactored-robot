import WebSocket from 'ws';

export function connectWebSocketWithRetry(url, onConnected, interval = 3000) {
  function attemptConnection() {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      onConnected(socket); 
    };

    socket.onerror = (err) => {
      console.log(`[WebSocket] Connection failed. Retrying in ${interval / 1000}s...`);
      setTimeout(attemptConnection, interval);
    };
  }

  attemptConnection();
}