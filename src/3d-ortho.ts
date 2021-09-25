import vertexShaderSource from './shaders/3d-ortho.vert'
import fragmentShaderSource from './shaders/helloworld.frag'
import {
  createProgramFromSources,
  resizeCanvasToDisplaySize,
  showWebGLUnsupportedError,
} from './webglUtils'
import * as webglLessonsUI from './webgl-lessons-ui'
import { degToRad, m4, radToDeg } from './math'

const main = () => {
  // Get A WebGL context
  const canvas: HTMLCanvasElement = document.querySelector('#c')
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    showWebGLUnsupportedError(canvas)
    return
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  const program = createProgramFromSources(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ])

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  // look up uniform locations
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

  // Create a buffer
  const positionBuffer = gl.createBuffer()

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // Set Geometry.
  setGeometry(gl)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 3 // 3 components per iteration
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
  // to hold the translation,
  const translation = [45, 150, 0]
  const rotation = [degToRad(40), degToRad(25), degToRad(325)]
  const scale = [1, 1, 1]
  const color = [Math.random(), Math.random(), Math.random(), 1]

  drawScene()

  // Setup a ui.
  webglLessonsUI.setupSlider('#x', {
    slide: updatePosition(0),
    max: gl.canvas.width,
    value: translation[0],
  })
  webglLessonsUI.setupSlider('#y', {
    slide: updatePosition(1),
    max: gl.canvas.height,
    value: translation[1],
  })
  webglLessonsUI.setupSlider('#z', {
    slide: updatePosition(2),
    max: 400,
    value: translation[2],
  })
  webglLessonsUI.setupSlider('#angleX', {
    slide: updateAngle(0),
    max: gl.canvas.width,
    value: radToDeg(rotation[0]),
  })
  webglLessonsUI.setupSlider('#angleY', {
    slide: updateAngle(1),
    max: gl.canvas.height,
    value: radToDeg(rotation[1]),
  })
  webglLessonsUI.setupSlider('#angleZ', {
    slide: updateAngle(2),
    max: 400,
    value: radToDeg(rotation[2]),
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
  webglLessonsUI.setupSlider('#scaleZ', {
    value: scale[1],
    slide: updateScale(2),
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

  function updateAngle(index: number) {
    return (event: Event, ui: { value: number }) => {
      const degrees = 360 - ui.value
      rotation[index] = degToRad(degrees)
      drawScene()
    }
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

    // Set a random color
    gl.uniform4fv(colorLocation, color)

    // Compute the matrix
    const matrix = [
      m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400),
      m4.translation(translation[0], translation[1], translation[2]),
      m4.xRotation(rotation[0]),
      m4.yRotation(rotation[1]),
      m4.zRotation(rotation[2]),
      m4.scaling(scale[0], scale[1], scale[2]),
    ].reduce(m4.multiply)

    // Set the matrix
    gl.uniformMatrix4fv(matrixLocation, false, matrix)

    // Draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 18
    gl.drawArrays(primitiveType, offset, count)
  }

  function setGeometry(gl: WebGL2RenderingContext) {
    // prettier-ignore
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // left column
          0,   0,  0,
         30,   0,  0,
          0, 150,  0,
          0, 150,  0,
         30,   0,  0,
         30, 150,  0,

        // top rung
         30,   0,  0,
        100,   0,  0,
         30,  30,  0,
         30,  30,  0,
        100,   0,  0,
        100,  30,  0,

        // middle rung
         30,  60,  0,
         67,  60,  0,
         30,  90,  0,
         30,  90,  0,
         67,  60,  0,
         67,  90,  0]),
      gl.STATIC_DRAW
    )
  }
}

main()
