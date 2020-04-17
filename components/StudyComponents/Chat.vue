<template>
  <div id="classroom-chat">
    <div id="chat-messages">
      <div
        class="chat-message"
        :class="{'message-by-me':message.sentByMe}"
        v-for="message in messages"
        :key="message.messageId"
      >
        <div class="message-sender">
          <img :src="`/Images/${message.sender.avatar}`" alt="User Avatar" />
          <h5 v-if="!message.sentByMe">{{message.sender.name}}</h5>
        </div>
        <p class="message-content">{{message.message}}</p>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="chat-form">
      <input v-model="message" @focus="someoneIsTyping" type="text" :placeholder="placeholder" />
      <input type="submit" value="Send" />
    </form>
    <!-- <img :src="`/Images/${courseclass.teacher.avatar}`" alt="User Avatar" /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      message: '',
      sendingMessage: false,
      messages: [],
      placeholder: 'type something'
    }
  },
  computed: mapState({
    user: state => state.user
  }),
  methods: {
    sendMessage() {
      this.sendingMessage = true
      const message = {
        message: this.message,
        timestamp: Date.now(),
        sentByMe: true,
        sender: {
          name: 'Saber',
          avatar: 'Saber.jpg'
        }
      }

      if (this.sendingMessage) {
        this.messages.push(message)
        // this.message = ''
        // this.sendingMessage = false
      }

      this.$socket.emit('message_sent', {
        classroomId: this.$route.params.classroomId,
        message: {
          message: this.message,
          timestamp: Date.now(),
          sentBy: {
            name: this.user.name,
            avatar: this.user.avatar,
            userId: this.user._id
          }
        }
      })
      this.message = ''
      this.sendingMessage = false
    },
    someoneIsTyping() {
      this.$socket.emit('someoneIsTyping', {
        name: this.user.name,
        userId: this.user._id,
        classroomId: this.$route.params.classroomId
      })
    }
  },
  sockets: {
    message_received(message) {
      if (message.sentBy.userId !== this.user._id) {
        this.messages.push({
          message: message.message,
          timestamp: message.timestamp,
          sender: {
            name: message.sentBy.name,
            avatar: message.sentBy.avatar
          },
          messageId: message.timestamp,
          sentByMe: false
        })
      }
    },
    someone_is_typing(message) {
      if (message.userId !== this.user._id) {
        this.placeholder = `${message.name} is typing`
        setTimeout(() => {
          this.placeholder = 'type something'
        }, 5000)
      }
    }
  }
}
</script>
