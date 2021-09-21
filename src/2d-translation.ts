import vertexShaderSource from './shaders/scaling.vert'
import fragmentShaderSource from './shaders/helloworld.frag'
import {
  createProgramFromSources,
  resizeCanvasToDisplaySize,
} from './webglUtils'
import * as webglLessonsUI from './webgl-lessons-ui'

const main = () => {
  // Get a WebGL 2 context
  const canvas: HTMLCanvasElement = document.querySelector('#c')
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    console.error("Couldn't activate webgl2 context")
  }

  // Lint the two shaders into a program
  const program = createProgramFromSources(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ])

  // Look up where the vertex data needs to go
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  // look up uniform locations
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution'
  )
  const colorLocation = gl.getUniformLocation(program, 'u_color')

  const translationLocation = gl.getUniformLocation(program, 'u_translation')
  const rotationLocation = gl.getUniformLocation(program, 'u_rotation')
  const scaleLocation = gl.getUniformLocation(program, 'u_scale')

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer()

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Bind it to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // setRectangle(gl, translation[0], translation[1], width, height)
  setGeometry(gl)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2 // 2 components per iteration
  const type = gl.FLOAT // the data is 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  // First let's make some variables
  // to hold the translation, width and height of the rectangle
  const translation = [0, 0]
  const rotation = [0, 1]
  const scale = [1, 1]
  // const width = 100
  // const height = 30
  const color = [Math.random(), Math.random(), Math.random(), 1]

  drawScene()

  // Setup a ui.
  webglLessonsUI.setupSlider('#x', {
    slide: updatePosition(0),
    max: gl.canvas.width,
  })
  webglLessonsUI.setupSlider('#y', {
    slide: updatePosition(1),
    max: gl.canvas.height,
  })
  webglLessonsUI.setupSlider('#r', {
    slide: updateRotation,
    max: 360,
  })
  webglLessonsUI.setupSlider('#scaleX', {
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  })
  webglLessonsUI.setupSlider('#scaleY', {
    value: scale[1],
    slide: updateScale(1),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  })

  function updatePosition(index: number) {
    return (event: Event, ui: { value: number }) => {
      translation[index] = ui.value
      drawScene()
    }
  }

  function updateRotation(event: Event, ui: { value: number }) {
    const degrees = 360 - ui.value
    const rads = (Math.PI / 180) * degrees
    rotation[0] = Math.sin(rads)
    rotation[1] = Math.cos(rads)
    drawScene()
  }

  function updateScale(index: number) {
    return (event: Event, ui: { value: number }) => {
      scale[index] = ui.value
      drawScene()
    }
  }

  function drawScene() {
    resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio)

    // Tell WebGL hot to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Tell it to use our program
    gl.useProgram(program)

    // Bind the attribute/buffer set we want
    gl.bindVertexArray(vao)

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    // Set a random color
    gl.uniform4fv(colorLocation, color)

    // Set the translation
    gl.uniform2fv(translationLocation, translation)

    // Set the rotation
    gl.uniform2fv(rotationLocation, rotation)

    // Set the scale
    gl.uniform2fv(scaleLocation, scale)

    // Draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 18
    gl.drawArrays(primitiveType, offset, count)
  }

  // function setRectangle(
  //   gl: WebGL2RenderingContext,
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ) {
  //   const x1 = x
  //   const x2 = x + width
  //   const y1 = y
  //   const y2 = y + height
  //   gl.bufferData(
  //     gl.ARRAY_BUFFER,
  //     new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
  //     gl.STATIC_DRAW
  //   )
  // }

  function setGeometry(gl: WebGL2RenderingContext) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // left column
        0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

        // top rung
        30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

        // middle rung
        30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
      ]),
      gl.STATIC_DRAW
    )
  }
}

main()
