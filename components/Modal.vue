<template>
  <div class="modal-background-wrapper">
    <div class="modal-content-wrapper">
      <div class="modal-header">
        <slot name="header"></slot>
        <CloseIcon @click="closeModal" />
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from '~/static/Icons/x-circle.svg?inline'

export default {
  components: {
    CloseIcon,
  },
  data() {
    return {}
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
  },
  mounted() {
    document.onkeydown = (evt) => {
      evt = evt || window.event
      var isEscape = false
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc'
      } else {
        isEscape = evt.keyCode === 27
      }
      if (isEscape) {
        this.closeModal()
      }
    }
  },
}
</script>
