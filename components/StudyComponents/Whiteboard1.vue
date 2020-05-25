<template>
  <div class="whiteboard-wrapper">
    <div class="whiteboard-controls">
      <div class="whiteboard-colors">
        <button
          @click="canvas.activeColor=color"
          v-for="(color,index) in canvas.colors"
          :key="color.id"
          :style="{'background-color':canvas.colors[index]}"
        ></button>
      </div>
      <input type="range" min="1" max="12" v-model="canvas.strokeWidth" />
    </div>
    <canvas height="1200" width="1200" id="whiteboard-canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {
        colors: [
          '#003049',
          '#7bdff2',
          '#2a9d8f',
          '#457b9d',
          '#d9d9d9',
          '#3a0ca3',
          '#ef233c'
        ],
        activeColor: '#003049',
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
  /* border: 1px solid #aaa; */
  /* width: 100%; */
  /* height: 100%; */
  /* background-color: lightblue; */
}
.whiteboard-controls {
  display: flex;
  align-items: center;
}
input[type='range'] {
  -webkit-appearance: none;
  margin-top: 10px;
  /* margin: 18px 0; */
  width: 120px;
}
input[type='range']:focus {
  outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  background: #3071a9;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
}
input[type='range']::-webkit-slider-thumb {
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #000000;
  height: 20px;
  width: 12px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #367ebd;
}
input[type='range']::-moz-range-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #3071a9;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
}
input[type='range']::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
input[type='range']::-ms-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
input[type='range']::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']::-ms-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
input[type='range']:focus::-ms-fill-lower {
  background: #3071a9;
}
input[type='range']:focus::-ms-fill-upper {
  background: #367ebd;
}

.whiteboard-colors {
  margin-left: 12px;
}
.whiteboard-colors button {
  width: 40px;
  height: 30px;
  margin-right: 2px;
  /* background-color: var(--primary-font-color) !important; */
}
</style>