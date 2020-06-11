<template>
  <div class="editor-wrapper">
    <div class="language-selection-wrapper">
      <h4>Choose a langage</h4>
      <select name="editor-language" id="editor-language" @change="changeLanguage">
        <option value="javascript">Javascript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="json">JSON</option>
        <option value="php">PHP</option>
        <option value="go">GO</option>
      </select>
    </div>
    <MonacoEditor
      ref="editor"
      width="800"
      height="500"
      theme="vs-dark"
      :language="language"
      :options="options"
    ></MonacoEditor>
  </div>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue'

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      language: 'javascript',
      options: {
        fontFamily: 'Rubik',
        wordWrap: 'on'
      }
    }
  },
  methods: {
    changeLanguage(e) {
      this.language = e.target.value
    }
  },
  mounted() {
    this.$refs.editor.editor.layout({ width: 800, height: 500 })
  }
}
</script>

<style scoped lang="scss">
.editor-wrapper {
  background-color: var(--primary-background-color);
  color: var(--primary-font-color);
}
.language-selection-wrapper {
  display: flex;
  align-items: center;
  padding: 8px 12px;

  select {
    margin-left: 10px;
    padding: 4px 8px;
    border-radius: 2px;

    option {
      background-color: var(--primary-background-color);
      color: var(--primary-font-color);
    }
  }
}
</style>