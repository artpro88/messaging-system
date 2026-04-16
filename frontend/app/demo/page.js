export default function DemoPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Live Chat Widget Demo</h1>
        <p>This page demonstrates the live chat widget in action.</p>
        
        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2>About Live Chat</h2>
          <p>
            The live chat widget is a lightweight embeddable script that can be placed 
            on any website. Customers can use it to start conversations with your support team.
          </p>
          
          <h3>Features:</h3>
          <ul>
            <li>✅ Real-time messaging via WebSocket</li>
            <li>✅ Customer identification (name & email)</li>
            <li>✅ Message history</li>
            <li>✅ Beautiful, responsive UI</li>
            <li>✅ Auto-connects to your backend</li>
          </ul>

          <h3>How to Embed:</h3>
          <p>Add this script to any website:</p>
          <code style={{
            display: 'block',
            background: '#fff',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            border: '1px solid #ddd'
          }}>
            &lt;script src="https://messaging-system-frontend.vercel.app/livechat-widget.js"&gt;&lt;/script&gt;
          </code>

          <h3>Customization:</h3>
          <p>You can customize the widget by setting local storage before embedding:</p>
          <code style={{
            display: 'block',
            background: '#fff',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            border: '1px solid #ddd'
          }}>
            localStorage.setItem('livechat_email', 'customer@example.com');<br/>
            localStorage.setItem('livechat_name', 'Customer Name');
          </code>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#e8f5e9',
          borderRadius: '8px'
        }}>
          <h3>🎉 The widget is already active on this page!</h3>
          <p>Look for the purple chat bubble in the bottom-right corner.</p>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: '#fff3e0',
          borderRadius: '8px'
        }}>
          <h4>📝 Next Steps:</h4>
          <ol>
            <li>Open the chat widget (bottom-right)</li>
            <li>Enter your name and email</li>
            <li>Send a test message</li>
            <li>Login to your admin dashboard to respond</li>
          </ol>
        </div>
      </div>

      <script src="/livechat-widget.js"></script>
    </div>
  );
}

