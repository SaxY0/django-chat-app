//chat/static/js/chat.js
let chatSocket = null;
let currentReceiver = null;

document.addEventListener('DOMContentLoaded', function() {
    // User selection
    document.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', function() {
            const userId = this.dataset.userId;
            const username = this.textContent.trim();
            
            document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            
            document.getElementById('chat-with').textContent = `Chat with ${username}`;
            currentReceiver = username;
            
            // Close existing socket if any
            if (chatSocket) {
                chatSocket.close();
            }
            
            // Connect to WebSocket
            const roomName = [currentUser, username].sort().join('_');
            chatSocket = new WebSocket(
                'ws://' + window.location.host + '/ws/chat/' + roomName + '/'
            );
            
            chatSocket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                displayMessage(data.message, data.sender);
            };
            
            // Load previous messages
            loadMessages(userId);
        });
    });
    
    // Send message
    document.getElementById('chat-message-submit').addEventListener('click', function() {
        sendMessage();
    });
    
    document.getElementById('chat-message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function loadMessages(userId) {
    fetch(`/messages/${userId}/`)
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                displayMessage(msg.content, msg.sender);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

function sendMessage() {
    const messageInput = document.getElementById('chat-message-input');
    const message = messageInput.value.trim();
    
    if (message && currentReceiver && chatSocket) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'receiver': currentReceiver
        }));
        messageInput.value = '';
    }
}

function displayMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === currentUser ? 'sent' : 'received');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}