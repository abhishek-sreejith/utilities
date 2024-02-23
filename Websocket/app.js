// Establish WebSocket connection
const socket = new WebSocket('wss://c83a7c2edk.execute-api.us-east-1.amazonaws.com/production/');

// Handle WebSocket open event
socket.addEventListener('open', function (event) {
    console.log('WebSocket connected');
});

// Handle WebSocket close event
socket.addEventListener('close', function (event) {
    console.log('WebSocket disconnected');
});

// Handle WebSocket message event
socket.addEventListener('message', function (event) {
    console.log('Message received:', event.data);
    displayMessage(event.data);
});

// Function to send message
function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    const data = {
        action: 'sendMessage',
        message: message
    };

    socket.send(JSON.stringify(data));
    messageInput.value = '';
}

function displayMessage(message) {
    const outputDiv = document.getElementById('output');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    outputDiv.appendChild(messageDiv);
}
