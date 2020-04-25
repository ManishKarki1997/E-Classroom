<template>
  <div class="whiteboard">
    <p>Whiteboard</p>
    <canvas height="800" width="1200" id="whiteboard-canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {
        colors: ['red', 'blue', 'lightblue', 'green', 'salmon'],
        activeColor: '#000',
        strokeWidth: 1,
        canvas: null,
        context: null,
        isDrawing: false,
        currentData: {}
      }
    }
  },
  sockets: {
    drawing_data(drawingData) {
      //   const { x, y, color, lineWidth } = drawingData
      //   this.onDrawingEvent(drawingData)
      //   this.drawLine(x, y, color, lineWidth)
      console.log(drawingData)
    }
  },
  methods: {
    drawLine(x, y, color, strokeWidth, emit) {
      this.canvas.context.lineTo(x, y)
      this.canvas.context.stroke()
      this.canvas.context.beginPath()
      this.canvas.context.strokeStyle = color
      this.canvas.context.lineWidth = strokeWidth
      this.canvas.context.moveTo(x, y)

      if (!emit) return

      this.$socket.emit('someone_drew', {
        classroomId: this.$route.params.classroomId,
        drawing: {
          x,
          y,
          color,
          lineWidth: strokeWidth
        }
      })
    },
    onMouseDown(e) {
      this.canvas.isDrawing = true
      this.canvas.context.beginPath()
      const { x, y } = this.getMousePos(e)
      this.canvas.currentData.x = x
      this.canvas.currentData.y = y
    },
    onMouseUp(e) {
      if (!this.canvas.isDrawing) {
        return
      }
      this.canvas.isDrawing = false
      this.drawLine(
        this.canvas.currentData.x,
        this.canvas.currentData.y,
        this.canvas.activeColor,
        this.canvas.strokeWidth,
        true
      )
    },
    onMouseMove(e) {
      if (!this.canvas.isDrawing) return

      this.drawLine(
        this.canvas.currentData.x,
        this.canvas.currentData.y,
        this.canvas.activeColor,
        this.canvas.strokeWidth,
        true
      )

      const { x, y } = this.getMousePos(e)
      this.canvas.currentData.x = x
      this.canvas.currentData.y = y
    },
    throttle(callback, delay) {
      let previousCall = new Date().getTime()
      return function() {
        let time = new Date().getTime()

        if (time - previousCall >= delay) {
          previousCall = time
          callback.apply(null, arguments)
        }
      }
    },
    getMousePos(e) {
      const rect = this.canvas.canvas.getBoundingClientRect()
      return {
        x:
          ((e.offsetX * this.canvas.canvas.width) /
            this.canvas.canvas.clientWidth) |
          0,
        y:
          ((e.offsetY * this.canvas.canvas.height) /
            this.canvas.canvas.clientHeight) |
          0
      }
    },
    onDrawingEvent(data) {
      const w = this.canvas.width
      const h = this.canvas.height
      this.drawLine(data.x * w, data.y * h, data.color, data.strokeWidth)
    }
  },
  mounted() {
    this.canvas.canvas = document.getElementById('whiteboard-canvas')
    this.canvas.context = this.canvas.canvas.getContext('2d')

    this.canvas.canvas.addEventListener('mousedown', this.onMouseDown, false)
    this.canvas.canvas.addEventListener('mouseup', this.onMouseUp, false)
    this.canvas.canvas.addEventListener(
      'mousemove',
      this.throttle(this.onMouseMove, 15),
      false
    )
  }
}
</script>

<style scoped>
.whiteboard {
  color: black !important;
}
#whiteboard-canvas {
  border: 1px solid #aaa;
  /* width: 100%; */
  /* height: 100%; */
  /* background-color: lightblue; */
}
</style>