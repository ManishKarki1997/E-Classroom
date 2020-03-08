<template>
  <div class="whiteboard-wrapper">
    <div class="whiteboard-toolbars">
      <div class="whiteboard-colors">
        <p style="margin-right:8px;">Palette</p>
        <p
          class="whiteboard-color"
          v-for="color in canvas.colors"
          :key="'color' + color"
          :style="{'backgroundColor':color}"
          @click="canvas.selectedColor=color"
        ></p>
      </div>
      <div class="line-width-selection">
        <p>Line Width ({{canvas.lineWidth}})</p>
        <input
          type="range"
          name="line-width"
          id="line-width"
          min="1"
          max="15"
          v-model="canvas.lineWidth"
          class="line-width-slider"
        />
      </div>
    </div>
    <canvas id="whiteboard-canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {
        colors: [
          '#005691',
          '#9896f1',
          '#fbe1b6',
          '#74f9ff',
          '#bad7df',
          '#ffbd39',
          '#f73859',
          '#39065a',
          '#45eba5'
        ],
        selectedColor: '#005691',
        lineWidth: 1,
        currentlyPainting: false,
        mousePosition: {
          x: 0,
          y: 0
        }
      }
    }
  },
  mounted() {
    const canvas = document.getElementById('whiteboard-canvas')
    const ctx = canvas.getContext('2d')

    const startPosition = e => {
      this.canvas.currentlyPainting = true
      draw(e)
    }

    const finishedPosition = () => {
      this.canvas.currentlyPainting = false
      ctx.beginPath()
    }

    const getMousePos = e => {
      const rect = canvas.getBoundingClientRect()
      return {
        mouseX: ((e.offsetX * canvas.width) / canvas.clientWidth) | 0,
        mouseY: ((e.offsetY * canvas.height) / canvas.clientHeight) | 0
      }
    }

    const draw = e => {
      if (!this.canvas.currentlyPainting) return
      ctx.lineWidth = this.canvas.lineWidth
      ctx.lineCap = 'round'
      ctx.strokeStyle = this.canvas.selectedColor
      //   after canvas is resized, the actual mouse position changes
      // the e.clientX and e.clientY only works in normal canvas size
      const { mouseX, mouseY } = getMousePos(e)
      ctx.imageSmoothingEnabled = false
      ctx.lineTo(mouseX, mouseY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(mouseX, mouseY)
    }

    canvas.addEventListener('mousedown', startPosition)
    canvas.addEventListener('mouseup', finishedPosition)
    canvas.addEventListener('mousemove', draw)
  }
}
</script>
