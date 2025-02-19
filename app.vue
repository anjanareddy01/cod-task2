<template>
  <div id="app">
    <div class="chat-box">
      <h2>Real-Time Chat</h2>
      <div class="messages" ref="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.user }}:</strong> {{ msg.message }}
        </div>
      </div>
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        type="text" 
        placeholder="Type a message..." 
        class="message-input" 
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null, // WebSocket connection
      messages: [], // List of messages
      newMessage: '' // Message input by the user
    };
  },
  created() {
    // Open WebSocket connection
    this.socket = new WebSocket('ws://localhost:3000');
    
    // Listen for incoming messages from the server
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages.push(message);
      this.scrollToBottom();
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        // Send the new message to the WebSocket server
        const message = {
          user: 'User',
          message: this.newMessage
        };
        this.socket.send(JSON.stringify(message));
        this.newMessage = ''; // Reset input field
      }
    },
    scrollToBottom() {
      const messagesContainer = this.$refs.messages;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: #f1f1f1;
  height: 100vh;
}

.chat-box {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.messages {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.message {
  text-align: left;
  padding: 5px;
}

.message-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
