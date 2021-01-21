<template>
  <div>
    <div class="drawing-controls-wrapper">
      <div class="drawing-controls">
        <div class="drawing-color-palette">
          <div
            class="palette"
            :style="{ backgroundColor: palette }"
            v-for="palette in colorPalette"
            :key="palette"
            @click="drawingData.color = palette"
          ></div>
        </div>
        <div class="line-width">
          <label for="lineWidth">Line Width</label>
          <input
            type="range"
            name="lineWidth"
            id="lineWidth"
            min="1"
            max="10"
            v-model="drawingData.lineWidth"
          />
          <span>{{ drawingData.lineWidth }}</span>
          <button @click="ctx.clearRect(0, 0, canvas.width, canvas.height)">
            Clear
          </button>
        </div>
      </div>
    </div>
    <canvas
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
      id="canvas"
    ></canvas>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      canvas: null,
      colorPalette: [
        '#f38181',
        '#c9d6df',
        '#07689f',
        '#95e1d3',
        '#fce38a',
        '#ff2e63',
        '#2b2e4a',
        '#aedefc',
      ],
      drawingData: {
        color: 'black',
        x: '',
        y: '',
        lineWidth: 1,
      },
      ctx: null,
      isPainting: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    onMouseMove(e) {
      if (!this.isPainting) {
        return
      }
      const { x, y } = this.getMouseCoordinates(e)

      this.drawLine(
        this.drawingData.x,
        this.drawingData.y,
        x,
        y,
        this.drawingData.color,
        true,
        this.drawingData.lineWidth
      )
      //   this.drawingData.x = e.clientX || e.touches[0].clientX
      //   this.drawingData.y = e.clientY || e.touches[0].clientY
      this.drawingData.x = x
      this.drawingData.y = y
    },
    onMouseDown(e) {
      this.isPainting = true
      const { x, y } = this.getMouseCoordinates(e)
      this.drawingData.x = x
      this.drawingData.y = y
    },
    onMouseUp(e) {
      if (!this.isPainting) {
        return
      }
      this.isPainting = false
      const { x, y } = this.getMouseCoordinates(e)

      this.drawLine(
        this.drawingData.x,
        this.drawingData.y,
        x,
        y,
        this.drawingData.color,
        true,
        this.drawingData.lineWidth
      )
    },
    getMouseCoordinates(e) {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    },
    drawLine(x0, y0, x1, y1, color, emit, lineWidth) {
      this.ctx.beginPath()
      this.ctx.moveTo(x0, y0)
      this.ctx.lineTo(x1, y1)
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = lineWidth
      this.ctx.stroke()
      this.ctx.closePath()

      if (!emit) {
        return
      }
      var w = this.canvas.width
      var h = this.canvas.height

      this.$socket.emit('someone_drew', {
        drawing: {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
          lineWidth: this.drawingData.lineWidth,
        },
        classroomId: this.$route.params.classId,
      })
    },
  },
  sockets: {
    drawing_data(data) {
      const w = this.canvas.width
      const h = this.canvas.height
      this.drawLine(
        data.x0 * w,
        data.y0 * h,
        data.x1 * w,
        data.y1 * h,
        data.color,
        false,
        data.lineWidth
      )
    },
  },
  mounted() {
    this.canvas = document.getElementById('canvas')
    this.ctx = canvas.getContext('2d')
    canvas.height = window.innerHeight - 170
    canvas.width = window.innerWidth - 170
    // canvas.height = 500
    // canvas.width = 300

    // this.$socket.emit('join_class', {
    //   classroomId: this.$route.params.classId,
    //   userId: this.user._id,
    // })
  },
}
</script>

<style lang="scss" scoped>
.drawing-controls-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  .drawing-controls {
    display: flex;
    align-items: center;
    .drawing-color-palette {
      display: flex;
      flex-wrap: wrap;
      margin-right: 1rem;

      .palette {
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
    }

    button {
      @include primaryButton;
    }
  }
}
#canvas {
  border: 1px solid black;
}
</style>
