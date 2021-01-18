<template>
  <div id="class-chat-page">
    <div class="class-chat-body">
      <div class="messages" v-for="message in chatMessages" :key="message._id">
        <div class="message-wrapper">
          <div
            class="message"
            :class="{ messageByMe: user._id === message.author._id }"
          >
            <div class="message--left">
              <img
                :src="apiUrl + '/uploads/images/' + message.author.avatar"
                alt
              />
            </div>
            <div class="message--right">
              <h4>{{ message.author.name }}</h4>
              <p v-html="message.message"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="send-message-content-wrapper">
      <quill-editor
        class="quill-editor"
        ref="editor"
        v-model="content"
        :options="editorOption"
      />
      <div class="send-button">
        <button @click="sendMessage">
          <SendIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SendIcon from '~/static/Icons/send.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

import hljs from 'highlight.js'
import 'highlight.js/styles/nord.css'

hljs.configure({
  languages: ['javascript', 'java', 'python', 'php'],
})

export default {
  components: {
    SendIcon,
  },
  data() {
    return {
      chatMessages: [],
      messageToSend: '',

      content: '',
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
          ],
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters(['apiUrl', 'user', 'currentlyViewingClass']),
  },
  methods: {
    sendMessage() {
      if (this.content.trim() === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please type something',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }
      let newMessage = {
        classId: this.currentlyViewingClass._id,
        message: this.content.trim(),
        author: {
          _id: this.user._id,
          avatar: this.user.avatar,
          name: this.user.name,
        },
      }

      this.$socket.emit('SEND_NEW_MESSAGE', newMessage)

      this.content = ''
    },
    scrollToTheEnd() {
      let messagesWrapper = document.querySelector('.messages')
      // messagesWrapper.scrollTop = messagesWrapper.scrollHeight || 0
    },
    async fetchClassChat() {
      const response = await this.$store.dispatch(
        'fetchClassChat',
        this.currentlyViewingClass._id
      )

      this.chatMessages = response.data.payload.chatMessages
    },
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
          avatar: message.author.avatar,
        },
        createdAt: message.createdAt,
      })
      this.scrollToTheEnd()
      // this.$forceUpdate() // ba  d idea
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

<style lang="scss">
#class-chat-page {
  .class-chat-body {
    background-color: var(--primary-background-color);
    padding: 1rem;
    overflow: auto;
    margin: 0 auto;
    min-height: 55vh;
    .messages {
      .message-wrapper {
        width: 100%;
        .message {
          display: flex;
          margin-bottom: 1rem;
          border-radius: 5px;
          padding: 12px;
          max-width: 60%;
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
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
  .send-message-content-wrapper {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    .quill-editor {
      width: 100%;
      background-color: var(--primary-background-color);
      // height: 100px;
      // max-height: 150px;
      margin-top: 2rem;
      margin-right: 1rem;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .ql-container {
        background-color: var(--primary-background-color);
        // height: 100%;
        // min-height: 80px;
        border: none !important;
      }
      .ql-toolbar.ql-snow {
        // background-color: var(--primary-background-color);
        height: 100%;
        border: none !important;

        .ql-formats {
          margin-top: 1rem;
        }
      }
    }

    .send-button {
      margin-top: 1.5rem;
      button {
        @include primaryButton(false, true);

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>
