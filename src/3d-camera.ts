import vertexShaderSource from './shaders/3d-perspective.vert'
import fragmentShaderSource from './shaders/3d-ortho.frag'
import {
  createProgramFromSources,
  resizeCanvasToDisplaySize,
  showWebGLUnsupportedError,
} from './webglUtils'
import * as webglLessonsUI from './webgl-lessons-ui'
import { degToRad, m4, up, Vec3 } from './math'

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

  const fieldOfViewRadians = degToRad(60)
  let cameraAngleRadians = 0
  let rotationSpeed = 1.2
  const numFs = 5
  const radius = 200

  let then = 0

  requestAnimationFrame(drawScene)

  // Setup a ui.
  webglLessonsUI.setupSlider('#ui', {
    name: 'rotationSpeed',
    slide: (evt, data) => {
      rotationSpeed = data.value
    },
    precision: 2,
    step: 0.01,
    min: -5,
    max: 5,
    value: rotationSpeed,
  })

  function drawScene(now: number) {
    // Convert the time to seconds
    now *= 0.001
    // Subtract the previous time from the current time
    const deltaTime = now - then
    // Remember the current time for the next frame
    then = now

    cameraAngleRadians += rotationSpeed * deltaTime

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
    const projectionMatrix = m4.perspective(
      fieldOfViewRadians,
      aspect,
      zNear,
      zFar
    )

    // Compute the position of the first F
    const fPosition: Vec3 = [radius, 0, 0]

    // Use matrix math to compute a position on the circle.
    const cameraMatrix = m4.multiply(
      m4.yRotation(cameraAngleRadians),
      m4.translation(0, 50, radius * 1.5)
    )

    // Get the camera's position from the matrix we computed
    const cameraPosition: Vec3 = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ]

    // Compute the camera's matrix using look at.
    const lookAtMatrix = m4.lookAt(cameraPosition, fPosition, up())

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(lookAtMatrix)

    // move the projection space to view space (the space in front of the camera)
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

    for (let i = 0; i < numFs; ++i) {
      const angle = (i * Math.PI * 2) / numFs

      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // add in the translation for this F
      const matrix = m4.multiply(viewProjectionMatrix, m4.translation(x, 0, z))

      // Set the matrix
      gl.uniformMatrix4fv(matrixLocation, false, matrix)

      // Draw
      const primitiveType = gl.TRIANGLES
      const offset = 0
      const count = 16 * 6
      gl.drawArrays(primitiveType, offset, count)
    }

    requestAnimationFrame(drawScene)
  }

  function setGeometry(gl: WebGL2RenderingContext) {
    // prettier-ignore
    const positions = new Float32Array(
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
    ])

    // Center the F around the origin and Flip it around. We do this because
    // we're in 3D now with and +Y is up where as before when we started with 2D
    // we had +Y as down.

    // We could do by changing all the values above but I'm lazy.
    // We could also do it with a matrix at draw time but you should
    // never do stuff at draw time if you can do it at init time.
    const matrix = m4.multiply(
      m4.xRotation(Math.PI),
      m4.translation(-50, -75, -15)
    )

    for (let ii = 0; ii < positions.length; ii += 3) {
      const vector = m4.transformVector(matrix, [
        positions[ii + 0],
        positions[ii + 1],
        positions[ii + 2],
        1,
      ])
      positions[ii + 0] = vector[0]
      positions[ii + 1] = vector[1]
      positions[ii + 2] = vector[2]
    }

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  }

  // Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
  function setColors(gl: WebGL2RenderingContext) {
    // prettier-ignore
    const colors = new Uint8Array([
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
      ])
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
  }
}

main()
