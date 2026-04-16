/**
 * Live Chat Widget - Embed this script on any website
 * Usage: <script src="https://your-domain.com/livechat-widget.js"></script>
 */

(function() {
  const API_URL = 'https://messaging-system-backend.vercel.app/api/livechat';
  const SOCKET_URL = 'https://messaging-system-backend.vercel.app';

  let conversationId = null;
  let customerId = null;
  let socket = null;

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
      <div id="livechat-widget" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <h3 style="margin: 0;">Live Chat Support</h3>
          <button id="livechat-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          ">×</button>
        </div>

        <div id="livechat-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          gap: 12px;
        "></div>

        <div style="padding: 12px; border-top: 1px solid #e0e0e0;">
          <textarea id="livechat-input" placeholder="Type your message..."
            style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
            resize: none;
            height: 40px;
          "></textarea>
          <button id="livechat-send" style="
            width: 100%;
            margin-top: 8px;
            padding: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">Send</button>
        </div>
      </div>

      <button id="livechat-toggle" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
      ">💬</button>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    setupEventListeners();
  }

  function setupEventListeners() {
    const toggle = document.getElementById('livechat-toggle');
    const widget = document.getElementById('livechat-widget');
    const closeBtn = document.getElementById('livechat-close');
    const sendBtn = document.getElementById('livechat-send');
    const input = document.getElementById('livechat-input');

    toggle.addEventListener('click', () => {
      widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
      toggle.style.display = toggle.style.display === 'none' ? 'block' : 'none';
      if (widget.style.display === 'flex') {
        initializeChat();
      }
    });

    closeBtn.addEventListener('click', () => {
      widget.style.display = 'none';
      toggle.style.display = 'block';
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  async function initializeChat() {
    if (conversationId) return;

    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: localStorage.getItem('livechat_email') || `guest_${Date.now()}@guest.com`,
          name: localStorage.getItem('livechat_name') || 'Guest',
          metadata: { origin: window.location.hostname }
        })
      });

      const data = await response.json();
      conversationId = data.conversationId;
      customerId = data.customerId;

      displayMessages(data.messages);

      // Connect to WebSocket
      connectWebSocket();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  }

  function connectWebSocket() {
    const socketScript = document.createElement('script');
    socketScript.src = 'https://cdn.socket.io/4.6.1/socket.io.min.js';
    socketScript.onload = () => {
      socket = io(SOCKET_URL);
      socket.on('connect', () => {
        socket.emit('livechat-connect', conversationId);
      });
      socket.on('new-message', (msg) => {
        addMessage(msg.content, 'agent', msg.createdAt);
      });
    };
    document.head.appendChild(socketScript);
  }

  async function sendMessage() {
    const input = document.getElementById('livechat-input');
    const content = input.value.trim();
    if (!content) return;

    try {
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content })
      });

      addMessage(content, 'customer');
      input.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  function displayMessages(messages) {
    const container = document.getElementById('livechat-messages');
    container.innerHTML = '';
    messages.forEach(msg => {
      addMessage(msg.content, msg.direction === 'incoming' ? 'customer' : 'agent', msg.created_at);
    });
  }

  function addMessage(content, sender, timestamp) {
    const container = document.getElementById('livechat-messages');
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      align-self: ${sender === 'customer' ? 'flex-end' : 'flex-start'};
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 12px;
      background: ${sender === 'customer' ? '#667eea' : '#e0e0e0'};
      color: ${sender === 'customer' ? 'white' : 'black'};
      word-wrap: break-word;
    `;
    bubble.textContent = content;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();

