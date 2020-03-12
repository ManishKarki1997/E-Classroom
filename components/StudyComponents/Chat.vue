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
      <input v-model="message" type="text" placeholder="type a message" />
      <input type="submit" value="Send" />
    </form>
    <!-- <img :src="`/Images/${courseclass.teacher.avatar}`" alt="User Avatar" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      sendingMessage: false,
      messages: [
        {
          messageId: 'message001',
          sender: {
            name: 'Saber',
            avatar: 'Saber.jpg'
          },
          timestamp: '2:53 pm',
          message: 'Well hello there',
          sentByMe: false
        },
        {
          messageId: 'message002',
          sender: {
            name: 'UwU',
            avatar: 'Saber.jpg'
          },
          timestamp: '2:54 pm',
          message: 'Hi Hi Hi',
          sentByMe: true
        },
        {
          messageId: 'message003',
          sender: {
            name: 'Saber',
            avatar: 'Saber.jpg'
          },
          timestamp: '2:55 pm',
          message: 'This has been an interesting chat',
          sentByMe: false
        },
        {
          messageId: 'message004',
          sender: {
            name: 'UwU',
            avatar: 'Saber.jpg'
          },
          timestamp: '2:55 pm',
          message:
            'Shut up ugh. The girl in the animation is named Mikumo Guynemer from the anime Macross Delta. She is the lead singer of the fictional idol group known as "Walküre"',
          sentByMe: true
        }
      ]
    }
  },
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

      setTimeout(() => {
        if (this.sendingMessage) {
          this.messages.push(message)
          this.message = ''
          this.sendingMessage = false
        }
      }, 1500)
    }
  }
}
</script>
