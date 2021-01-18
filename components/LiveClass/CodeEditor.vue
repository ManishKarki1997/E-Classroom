<template>
  <div>
    <quill-editor
      class="quill-editor"
      ref="editor"
      @change="onEditorChange($event)"
      :options="editorOption"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import hljs from 'highlight.js'
// import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/styles/nord.css'

hljs.configure({
  languages: ['javascript', 'java', 'python', 'php'],
})

export default {
  data() {
    return {
      content: '',
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            // ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            ['code-block'],
          ],
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.$socket.emit('code_editor_typing', {
        sender: this.user._id,
        classroomId: this.$route.params.classId,
        content: html,
      })
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
  sockets: {
    code_editor_typing(data) {
      if (data.sender !== this.user._id) {
        const delta = this.$refs.editor.quill.clipboard.convert(data.content)
        this.$refs.editor.quill.setContents(delta, 'silent')
      }
    },
  },
  mounted() {
    console.log(
      document
        .querySelector(
          '.quill-editor .ql-toolbar .ql-formats button.ql-code-block'
        )
        .click()
    )
  },
}
</script>

<style lang="scss">
.ql-editor {
  min-height: 200px;
  font-family: 'Poppins';
}

.quill-editor {
  .ql-toolbar {
    visibility: hidden;
  }

  .ql-container {
    border: none;
  }
  .ql-syntax {
    height: 75vh;
    width: 100%;
    padding: 16px !important;
    font-size: 16px;
  }
}
</style>
