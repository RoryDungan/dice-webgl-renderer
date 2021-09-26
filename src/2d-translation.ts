import vertexShaderSource from './shaders/2d-transform-matrix.vert'
import fragmentShaderSource from './shaders/helloworld.frag'
import {
  createProgramFromSources,
  resizeCanvasToDisplaySize,
  showWebGLUnsupportedError,
} from './webglUtils'
import * as webglLessonsUI from './webgl-lessons-ui'
import { m3 } from './math'

const main = () => {
  // Get a WebGL 2 context
  const canvas: HTMLCanvasElement = document.querySelector('#c')
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    console.error("Couldn't activate webgl2 context")
    showWebGLUnsupportedError(canvas.parentElement)
    return
  }

  // Lint the two shaders into a program
  const program = createProgramFromSources(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ])

  // Look up where the vertex data needs to go
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  // look up uniform locations
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

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
  const translation = [150, 100]
  let rotationInRadians = 0
  const scale = [1, 1]
  // const width = 100
  // const height = 30
  const color = [Math.random(), Math.random(), Math.random(), 1]

  drawScene()

  // Setup a ui.
  webglLessonsUI.setupSlider('#ui', {
    name: 'x',
    slide: updatePosition(0),
    max: gl.canvas.width,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'y',
    slide: updatePosition(1),
    max: gl.canvas.height,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'r',
    slide: updateRotation,
    max: 360,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'scaleX',
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'scaleY',
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
    rotationInRadians = (Math.PI / 180) * degrees
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

    // Compute the matrics
    const projectionMatrix = m3.projection(
      gl.canvas.clientWidth,
      gl.canvas.clientHeight
    )
    const moveOriginMatrix = m3.translation(-50, -75)
    const translationMatrix = m3.translation(translation[0], translation[1])
    const rotationMatrix = m3.rotation(rotationInRadians)
    const scaleMatrix = m3.scaling(scale[0], scale[1])

    // Multiply the matrics
    const matrix = [
      projectionMatrix,
      translationMatrix,
      rotationMatrix,
      scaleMatrix,
      moveOriginMatrix,
    ].reduce(m3.multiply)

    // Set the matrix
    gl.uniformMatrix3fv(matrixLocation, false, matrix)

    // Set a random color
    gl.uniform4fv(colorLocation, color)

    // Draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 18
    gl.drawArrays(primitiveType, offset, count)
  }

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
