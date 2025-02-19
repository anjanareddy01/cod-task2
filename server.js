// server.js
const express = require('express');
const WebSocket = require('ws');
const app = express();
const http = require('http');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Serve static files from 'public' directory

// When a new WebSocket connection is established
wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log('Received: ' + message);

    // Broadcast the message to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Send a welcome message to the new client
  ws.send(JSON.stringify({ user: 'Server', message: 'Welcome to the chat!' }));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
