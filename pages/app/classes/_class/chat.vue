<template>
  <div id="chat-messages-wrapper">
    <ul class="messages" ref="messagesWrapper">
      <li
        :class="{ messageByMe: message.author._id === user._id }"
        class="message"
        v-for="message in chatMessages"
        :key="message._id"
      >
        <img :src="apiStaticUrl + '/uploads/images/' + message.author.avatar" alt="User Avatar" />
        <div class="message-text-wrapper">
          <h4>{{ message.author.name }}</h4>
          <p>{{ message.message }}</p>
        </div>
      </li>
    </ul>
    <div class="form-wrapper">
      <form @submit.prevent="sendMessage">
        <input autofocus type="text" name="chat-message" id="chat-message" v-model="messageToSend" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatMessages: [],
      classId: '',
      user: {},
      messageToSend: '',
      apiStaticUrl: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.messageToSend.trim() === '') {
        this.$toast.open({
          type: 'error',
          message: 'Please type something',
          position: 'top-right',
          duration: 1500
        })
        return
      }
      let newMessage = {
        classId: this.classId,
        message: this.messageToSend.trim(),
        author: {
          _id: this.user._id,
          avatar: this.user.avatar,
          name: this.user.name
        }
      }

      this.$socket.emit('SEND_NEW_MESSAGE', newMessage)

      this.messageToSend = ''
    },
    async fetchClassChat() {
      const response = await this.$store.dispatch(
        'fetchClassChat',
        this.classId
      )

      this.chatMessages = response.data.payload.chatMessages
    },
    scrollToTheEnd() {
      let messagesWrapper = document.querySelector('.messages')
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight
    }
  },
  sockets: {
    NEW_MESSAGE(message) {
      this.chatMessages.push({
        _id: message._id,
        message: message.message,
        classId: message.classId,
        author: {
          _id: message.author._id,
          name: message.author.name,
          avatar: message.author.avatar
        },
        createdAt: message.createdAt
      })
      this.scrollToTheEnd()
      // this.$forceUpdate() // bad idea
    }
  },
  mounted() {
    this.classId = this.$route.params.class
    this.user = this.$store.state.user
    this.$socket.emit('JOIN_CLASS_CHAT', { classId: this.classId })
    this.apiStaticUrl = process.env.baseUrl

    this.fetchClassChat()
  },
  updated() {
    this.scrollToTheEnd()
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--scroll-background-color);
  border-radius: 5px;
}

#chat-messages-wrapper {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

.messages {
  list-style-type: none;
  height: 90%;
  overflow: auto;

  .message {
    margin-bottom: 2rem;
    display: flex;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .message-text-wrapper {
      p {
        font-size: 12px;
      }
    }
  }
}
.messageByMe {
  justify-content: flex-end;
  text-align: right;
  img {
    order: 2;
    margin-left: 1rem;
  }
}

.form-wrapper {
  height: 10%;
  width: 100%;

  form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    input {
      width: 80%;
    }
  }
}
</style>
