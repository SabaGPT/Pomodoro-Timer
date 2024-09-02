<template>
  <div>
    <h1>Chat with AI</h1>
    <input
      type="text"
      v-model="inputText"
      placeholder="Enter your message"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">Send</button>
    <div v-if="aiResponse" class="response">
      {{ aiResponse }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatComponent",
  data() {
    return {
      inputText: "",
      aiResponse: "",
    };
  },
  methods: {
    async sendMessage() {
      if (this.inputText.trim()) {
        const response = await fetch(
          "https://your-worker.your-subdomain.workers.dev",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: this.inputText }),
          }
        );
        const data = await response.json();
        this.aiResponse = data.reply;
        this.inputText = "";
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");

body {
  font-family: "Playfair Display", serif;
}

h1 {
  color: #333;
  font-size: 64px;
  font-weight: 700;
}

input {
  margin-top: 20px;
  padding: 10px;
  width: 300px;
  font-size: 36px;
  font-family: "Playfair Display", serif;
}

button {
  font-size: 36px;
  padding: 10px 20px;
  margin-left: 10px;
  font-family: "Playfair Display", serif;
}

.response {
  margin-top: 20px;
  font-size: 24px;
  color: #555;
}
</style>
