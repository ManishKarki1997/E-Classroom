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
        },
        current: {}
      },
      classroomId: '',
      drawingCanvas: null,
      context: null
    }
  },
  sockets: {
    // drawing_data(drawingData) {
    //   const { x, y, color, lineWidth } = drawingData
    //   // this.drawLine(x, y, color, lineWidth, true)
    // }
  },
  methods: {
    drawLine(x, y, color, lineWidth, emit) {
      this.context.lineTo(x, y)
      this.context.stroke()
      this.context.beginPath()
      this.context.strokeStyle = color
      this.context.lineWidth = this.canvas.lineWidth
      this.context.moveTo(x, y)

      if (!emit) {
        return
      }

      this.$socket.emit('someone_drew', {
        classroomId: this.classroomId,
        drawing: {
          x,
          y,
          color,
          lineWidth
        }
      })
    }
  },
  mounted() {
    this.classroomId = this.$route.params.classroomId

    const canvas = document.getElementById('whiteboard-canvas')
    const context = canvas.getContext('2d')
    this.drawingCanvas = canvas
    this.context = context

    var drawing = false

    this.$socket.on('drawing_data', data => {
      console.log(data)
    })

    const getMousePos = e => {
      const rect = canvas.getBoundingClientRect()
      return {
        mouseX: ((e.offsetX * canvas.width) / canvas.clientWidth) | 0,
        mouseY: ((e.offsetY * canvas.height) / canvas.clientHeight) | 0
      }
    }

    const drawLine = (x1, y1, color, emit) => {
      context.lineTo(x1, y1)
      context.stroke()
      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = this.canvas.lineWidth
      context.moveTo(x1, y1)

      if (!emit) {
        return
      }
      var w = canvas.width
      var h = canvas.height

      this.$socket.emit('someone_drew', {
        classroomId: this.classroomId,
        drawing: {
          x: this.canvas.current.x,
          y: this.canvas.current.y,
          color: this.canvas.selectedColor,
          lineWidth: this.canvas.lineWidth
        }
      })
    }

    const onMouseDown = e => {
      drawing = true
      context.beginPath()

      this.canvas.current.x = (e.offsetX * canvas.width) / canvas.clientWidth
      this.canvas.current.y = (e.offsetY * canvas.height) / canvas.clientHeight
    }

    const onMouseUp = e => {
      if (!drawing) {
        return
      }
      drawing = false
      drawLine(
        (e.offsetX * canvas.width) / canvas.clientWidth || 0,
        (e.offsetY * canvas.height) / canvas.clientHeight || 0,
        // e.clientX || e.touches[0].clientX,
        // e.clientY || e.touches[0].clientY,
        this.canvas.selectedColor,
        true
      )
    }

    const onMouseMove = e => {
      if (!drawing) {
        return
      }
      drawLine(
        (e.offsetX * canvas.width) / canvas.clientWidth || 0,
        (e.offsetY * canvas.height) / canvas.clientHeight || 0,
        this.canvas.selectedColor,
        true
      )
      this.canvas.current.x = e.clientX || e.touches[0].clientX
      this.canvas.current.y = e.clientY || e.touches[0].clientY
    }

    // limit the number of events per second
    const throttle = (callback, delay) => {
      var previousCall = new Date().getTime()
      return function() {
        var time = new Date().getTime()

        if (time - previousCall >= delay) {
          previousCall = time
          callback.apply(null, arguments)
        }
      }
    }

    // const onDrawingEvent = data => {
    //   var w = canvas.width
    //   var h = canvas.height
    //   // drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    // }

    // make the canvas fill its parent
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', onResize, false)
    onResize()
    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mouseout', onMouseUp, false)
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)
  }
}
</script>
