const currentUser = document.getElementById('current-user').textContent;
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const toggleContainer = document.getElementById('toggleContainer');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('chat-message-input');
const sendButton = document.getElementById('chat-message-submit');

let chatSocket = null;
let currentReceiver = null;

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Function to update toggle button position
function updateTogglePosition() {
    if (window.innerWidth <= 768) {
        // Mobile behavior
        if (sidebar.classList.contains('collapsed')) {
            toggleContainer.style.left = '0px';
        } else {
            toggleContainer.style.left = '230px';
        }
    } else {
        // Desktop behavior
        if (sidebar.classList.contains('collapsed')) {
            toggleContainer.style.left = '0px';
        } else {
            toggleContainer.style.left = '230px';
        }
    }
}

// Initialize toggle position
updateTogglePosition();

// Sidebar toggle functionality
// Sidebar toggle functionality
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    sidebar.classList.toggle('collapsed');
    
    // Update toggle button position
    updateTogglePosition();
    
    // Update toggle icon
    const icon = menuToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('bi-x'); // Remove close icon
        icon.classList.add('bi-list'); // Add hamburger icon
    } else {
        icon.classList.remove('bi-list'); // Remove hamburger icon
        icon.classList.add('bi-x'); // Add close icon
    }
});


// Function to format timestamp
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return '';
    }
}

// Function to update user status
function updateUserStatus(username, status) {
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        if (item.querySelector('.username').textContent === username) {
            if (status === 'online') {
                item.classList.add('online');
            } else {
                item.classList.remove('online');
            }
        }
    });
}

// Function to send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message && currentReceiver && chatSocket) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'receiver': currentReceiver
        }));
        messageInput.value = '';
    }
}

// Message display function
function displayMessage(message, sender, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === currentUser ? 'sent' : 'received');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = message;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-timestamp');
    timeDiv.textContent = formatTimestamp(timestamp);

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load messages function
async function loadMessages(userId) {
    try {
        const response = await fetch(`/messages/${userId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const messages = await response.json();
        
        chatMessages.innerHTML = '';
        messages.forEach(msg => {
            displayMessage(msg.content, msg.sender, msg.timestamp);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
        chatMessages.innerHTML = '<div class="alert alert-danger">Error loading messages</div>';
    }
}

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    updateTogglePosition();
    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.add('collapsed');
            updateTogglePosition();
        }
    }
});

// User selection handler
document.querySelectorAll('.user-item').forEach(item => {
    if (!item.classList.contains('current-user')) {
        item.addEventListener('click', function() {
            const userId = this.dataset.userId;
            const username = this.querySelector('.username').textContent;
            
            document.querySelectorAll('.user-item').forEach(el => 
                el.classList.remove('active')
            );
            this.classList.add('active');
            document.getElementById('chat-with').textContent = `Chat with ${username}`;
            
            currentReceiver = username;
            
            if (chatSocket) {
                chatSocket.close();
            }
            
            const roomName = [currentUser, username].sort().join('_');
            chatSocket = new WebSocket(
                `ws://${window.location.host}/ws/chat/${roomName}/`
            );
            
            chatSocket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                if (data.type === 'status') {
                    updateUserStatus(data.user, data.status);
                } else {
                    displayMessage(data.message, data.sender, data.timestamp);
                }
            };

            loadMessages(userId);
            messageInput.focus();

            // Close sidebar on mobile after selecting user
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
                updateTogglePosition();
            }
        });
    }
});