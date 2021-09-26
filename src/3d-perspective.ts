import vertexShaderSource from './shaders/3d-perspective.vert'
import fragmentShaderSource from './shaders/3d-ortho.frag'
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
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color')

  // look up uniform locations
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

  let fieldOfView = degToRad(60)

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

  // create the color buffer, make it the current ARRAY_BUFFER
  // and copy in the color values
  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  setColors(gl)

  // Turn on the attribute
  gl.enableVertexAttribArray(colorAttributeLocation)

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  )

  // First let's make some variables
  // to hold the translation,
  const translation = [-150, 0, -360]
  const rotation = [degToRad(0), degToRad(170), degToRad(170)]
  const scale = [1, 1, 1]

  drawScene()

  // Setup a ui.
  webglLessonsUI.setupSlider('#ui', {
    name: 'fieldOfView',
    slide: (evt, data) => {
      fieldOfView = degToRad(data.value)
      drawScene()
    },
    min: 10,
    max: 180,
    precision: 3,
    step: 0.01,
    value: radToDeg(fieldOfView),
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'x',
    slide: updatePosition(0),
    min: -gl.canvas.width,
    max: gl.canvas.width,
    value: translation[0],
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'y',
    slide: updatePosition(1),
    min: -gl.canvas.height,
    max: gl.canvas.height,
    value: translation[1],
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'z',
    slide: updatePosition(2),
    min: -400,
    max: 400,
    value: translation[2],
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'angleX',
    slide: updateAngle(0),
    max: 360,
    value: radToDeg(rotation[0]),
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'angleY',
    slide: updateAngle(1),
    max: 360,
    value: radToDeg(rotation[1]),
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'angleZ',
    slide: updateAngle(2),
    max: 360,
    value: radToDeg(rotation[2]),
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
  webglLessonsUI.setupSlider('#ui', {
    name: 'scaleZ',
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
      const degrees = ui.value
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

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    // Tell WebGL hot to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Tell it to use our program
    gl.useProgram(program)

    // Bind the attribute/buffer set we want
    gl.bindVertexArray(vao)

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 1
    const zFar = 2000
    const projection = m4.perspective(fieldOfView, aspect, zNear, zFar)

    // Compute the matrix
    const matrix = [
      projection,
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
    const count = 16 * 6
    gl.drawArrays(primitiveType, offset, count)
  }

  function setGeometry(gl: WebGL2RenderingContext) {
    // prettier-ignore
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,
      ]),
      gl.STATIC_DRAW
    )
  }

  // Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
  function setColors(gl: WebGL2RenderingContext) {
    // prettier-ignore
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
      ]),
      gl.STATIC_DRAW)
  }
}

main()
