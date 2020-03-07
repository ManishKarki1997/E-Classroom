<template>
  <div class="whiteboard-wrapper">
    <div class="whiteboard-toolbars">
      <div class="whiteboard-colors">
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
        selectedColor: 'white',
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

<style scoped>
.whiteboard-wrapper {
  height: 100%;
}
#whiteboard-canvas {
  width: 100%;
  height: 100%;
}
.whiteboard-toolbars {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
.whiteboard-colors {
  display: flex;
  align-items: center;
}
.whiteboard-color {
  width: 25px;
  height: 25px;
}
.line-width-selection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
}
.line-width-selection p {
  font-size: 14px;
}
.line-width-slider {
  margin-left: 4px;
  -webkit-appearance: none;
  width: 60%;
  height: 15px;
  border-radius: 25px;
  background-color: #ebebeb;
  opacity: 0.9;
  outline: none;
  transition: opacity 0.3s;
}
.line-width-slider:hover {
  opacity: 1;
}
.line-width-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #222839;
  cursor: pointer;
}
</style>