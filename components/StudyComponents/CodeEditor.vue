<template>
  <div class="code-editor-wrapper">
    <div class="code-editor-language-options">
      <h5>Choose a language</h5>
      <select name="code-languages" id="code-languages" v-model="codeEditor.cmOptions.mode">
        <option value="text/javascript">Javascript</option>
        <option value="text/x-python">Python</option>
        <option value="text/x-mysql">SQL</option>
      </select>
    </div>
    <codemirror class="code-editor" v-model="codeEditor.code" :options="codeEditor.cmOptions"></codemirror>
  </div>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/sql/sql.js'

// theme css
import 'codemirror/theme/rubyblue.css'

export default {
  data() {
    return {
      codeEditor: {
        code: '',
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'rubyblue',
          lineNumbers: true,
          line: true,
          extraKeys: { Ctrl: 'autocomplete' }
        }
      }
    }
  }
}
</script>
<style scoped>
.code-editor-language-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 1rem;
  color: white;
}
.code-editor {
  height: 100%;
  width: 100%;
}
</style>