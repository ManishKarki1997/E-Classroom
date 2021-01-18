<template>
  <div class="class-chat-body">
    <div class="messages">
      <div class="message-wrapper" v-for="message in chatMessages" :key="message._id">
        <div class="message" :class="{ messageByMe: user._id === message.author._id }">
          <div class="message--left">
            <img :src="apiUrl + '/uploads/images/' + message.author.avatar" alt />
          </div>
          <div class="message--right">
            <h4>{{ message.author.name }}</h4>
            <p v-html="message.message"></p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="typingUsers.length>0" class="typing-users-wrapper">
      <p class="subtitle" v-if="typingUsers.length==1">
        <i>{{typingUsers[0]}} is typing</i>
      </p>
      <p class="subtitle" v-if="typingUsers.length==2">
        <i>{{typingUsers[0]}}</i>
        <i>{{typingUsers[1]}}</i> & are typing
      </p>
      <p class="subtitle" v-if="typingUsers.length==2">
        <i>{{typingUsers[0]}}</i> &
        <i>{{typingUsers.length -1}} others</i> are typing
      </p>
    </div>

    <form @submit.prevent="sendMessage">
      <input
        type="text"
        name="chatMessageArea"
        id="chatMessageArea"
        cols="40"
        rows="4"
        v-model="messageToSend"
        @input="typing"
        @focus="determingIfTyping"
        @blur="notTyping"
        placeholder="Type Something..."
      />

      <div class="send-button">
        <button type="submit" hidden>
          <SendIcon />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SendIcon from '~/static/Icons/send.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    SendIcon,
  },
  data() {
    return {
      chatMessages: [],
      messageToSend: '',
      typingUsers: [],
    }
  },
  computed: {
    ...mapGetters(['apiUrl', 'user', 'currentlyViewingClass']),
  },
  methods: {
    determingIfTyping() {
      if (this.messageToSend) {
        this.typing()
      } else {
        this.notTyping()
      }
    },
    typing() {
      this.$socket.emit('someoneIsTyping', {
        classroomId: this.currentlyViewingClass._id,
        user: this.user.name,
      })
    },
    notTyping() {
      this.$socket.emit('notTyping', {
        classroomId: this.currentlyViewingClass._id,
        user: this.user.name,
      })
    },
    sendMessage() {
      if (this.messageToSend.trim() === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please type something',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }
      let newMessage = {
        classId: this.$route.params.classId,
        message: this.messageToSend.trim(),
        author: {
          _id: this.user._id,
          avatar: this.user.avatar,
          name: this.user.name,
        },
      }

      this.$socket.emit('SEND_NEW_MESSAGE', newMessage)

      this.messageToSend = ''
    },
    scrollToTheEnd() {
      let messagesWrapper = document.querySelector('.messages')
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight
    },
    async fetchClassChat() {
      const response = await this.$store.dispatch(
        'fetchClassChat',
        this.$route.params.classId
      )

      this.chatMessages = response.data.payload.chatMessages
    },
  },
  sockets: {
    someone_is_typing(data) {
      this.typingUsers = data.filter((name) => name !== this.user.name)
    },
    notTyping(data) {
      this.typingUsers = data
    },
    NEW_MESSAGE(message) {
      this.chatMessages.push({
        _id: message._id,
        message: message.message,
        classId: message.classId,
        author: {
          _id: message.author._id,
          name: message.author.name,
          avatar: message.author.avatar,
        },
        createdAt: message.createdAt,
      })
      this.scrollToTheEnd()
    },
  },
  mounted() {
    this.fetchClassChat()
  },

  updated() {
    this.scrollToTheEnd()
  },
}
</script>

<style lang="scss" scoped>
.class-chat-body {
  background-color: var(--primary-background-color);

  .messages {
    height: 90%;
    overflow-x: auto;
    .message-wrapper {
      width: 100%;
      .message {
        display: flex;
        margin-bottom: 1rem;
        border-radius: 5px;
        padding: 12px;
        max-width: 90%;
        transition: all 0.3s ease-in-out;

        .ql-syntax {
          background: var(--opposite-background-color);
          color: var(--opposite-font-color);
          padding: 4px 8px;
          border-radius: 3px;
          margin-top: 4px;
        }

        blockquote {
          border-left: 4px solid #ccc;
          margin-bottom: 5px;
          margin-top: 5px;
          padding-left: 16px;
        }

        &.messageByMe {
          justify-content: flex-end;
          color: var(--primary-font-color);
          margin-left: auto;
          text-align: right;
          &:hover {
            background-color: var(--tertiary-background-color);
            color: var(--primary-font-color);
          }

          .message--left {
            order: 1;

            img {
              margin-left: 8px;
            }
          }
        }

        .message--left {
          margin-right: 8px;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }

        .message--right {
          p {
            font-size: 14px;
          }
        }
      }
    }
  }

  .typing-users-wrapper {
    margin-left: 1rem;
    margin-bottom: -12px;

    p {
      font-size: 12px;
      margin-bottom: 0;
    }
  }

  form {
    height: 10%;
    width: 100%;
    padding: 1rem;

    input[type='text'] {
      padding: 12px;
      border-radius: 5px;
      font-size: 14px;
      width: 100%;
      border: 1px solid var(--primary-border-color);
      background-color: var(--primary-background-color);
      color: var(--primary-font-color);
    }
  }
}
</style>
