// Replace 'YOUR_WEBSOCKET_ENDPOINT' with your WebSocket API endpoint
const websocketEndpoint = 'wss://c83a7c2edk.execute-api.us-east-1.amazonaws.com/production/';

// Create WebSocket connection
const socket = new WebSocket(websocketEndpoint);

// Event listener for when the connection is established
socket.onopen = (event) => {
    console.log('WebSocket connection established');
};

// Event listener for incoming messages from the server
socket.onmessage = (event) => {
    console.log('Received message from server:', event.data);
    
    // Handle incoming messages from the server
};

// Event listener for when the connection is closed
socket.onclose = (event) => {
    console.log('WebSocket connection closed');
};

// Event listener for errors
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Function to send a message to the server
function sendMessage(message) {
    socket.send(JSON.stringify({ action: 'sendMessage', message: message }));
}
