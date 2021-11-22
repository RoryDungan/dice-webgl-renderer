import vertexShaderSource from './shaders/3d-spotlight.vert'
import fragmentShaderSource from './shaders/3d-spotlight.frag'
import {
  createProgramFromSources,
  resizeCanvasToDisplaySize,
  showWebGLUnsupportedError,
} from './webglUtils'
import * as webglLessonsUI from './webgl-lessons-ui'
import { degToRad, m4, normalise, radToDeg, up, Vec3 } from './math'

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
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const normalLocation = gl.getAttribLocation(program, 'a_normal')

  // look up uniform locations
  const worldViewProjectionLocation = gl.getUniformLocation(
    program,
    'u_worldViewProjection'
  )
  const worldInverseTransposeLocation = gl.getUniformLocation(
    program,
    'u_worldInverseTranspose'
  )
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const lightWorldPositionLocation = gl.getUniformLocation(
    program,
    'u_lightWorldPosition'
  )
  const viewWorldPositionLocation = gl.getUniformLocation(
    program,
    'u_viewWorldPosition'
  )
  const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection')
  const innerLimitLocation = gl.getUniformLocation(program, 'u_innerLimit')
  const outerLimitLocation = gl.getUniformLocation(program, 'u_outerLimit')
  const worldLocation = gl.getUniformLocation(program, 'u_world')
  const shininessLocation = gl.getUniformLocation(program, 'u_shininess')
  const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
  const specularColorLocation = gl.getUniformLocation(
    program,
    'u_specularColor'
  )

  // Create a buffer
  const positionBuffer = gl.createBuffer()

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionLocation)

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Set Geometry.
  setGeometry(gl)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    positionLocation,
    3, // 3 components per iteration
    gl.FLOAT, // the data is 32bit floats
    false, // don't normalize the data
    0, // 0 = move forward size * sizeof(type) each iteration to get the next position
    0 // start at the beginning of the buffer
  )

  // Create a buffer for the normals
  const normalsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
  gl.enableVertexAttribArray(normalLocation)
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)

  // Set the normals
  setNormals(gl)

  const fieldOfViewRadians = degToRad(60)
  let rotationSpeed = 1.2
  let angle = 0
  let shininess = 150

  let lightRotationX = 0, lightRotationY = 0, innerLimit = degToRad(10), outerLimit = degToRad(20)

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
  webglLessonsUI.setupSlider('#ui', {
    name: 'shininess',
    slide: (evt, data) => {
      shininess = data.value
    },
    precision: 2,
    step: 0.01,
    min: 1,
    max: 300,
    value: shininess,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'lightRotationX',
    slide: (evt, data) => {
      lightRotationX = data.value
    },
    precision: 2,
    step: 0.001,
    min: -2,
    max: 2,
    value: lightRotationX,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'lightRotationY',
    slide: (evt, data) => {
      lightRotationY = data.value
    },
    precision: 2,
    step: 0.001,
    min: -2,
    max: 2,
    value: lightRotationY,
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'innerLimit',
    slide: (evt, data) => {
      innerLimit = degToRad(data.value)
    },
    precision: 2,
    step: 0.01,
    min: 0,
    max: 180,
    value: radToDeg(innerLimit),
  })
  webglLessonsUI.setupSlider('#ui', {
    name: 'outerLimit',
    slide: (evt, data) => {
      outerLimit = degToRad(data.value)
    },
    precision: 2,
    step: 0.01,
    min: 0,
    max: 180,
    value: radToDeg(outerLimit),
  })

  function drawScene(now: number) {
    // Convert the time to seconds
    now *= 0.001
    // Subtract the previous time from the current time
    const deltaTime = now - then
    // Remember the current time for the next frame
    then = now

    angle += rotationSpeed * deltaTime

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

    const camera: Vec3 = [100, 150, 200]
    const target: Vec3 = [0, 35, 0]
    const cameraMatrix = m4.lookAt(camera, target, up())

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix)

    // move the projection space to view space (the space in front of the camera)
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

    // add in the translation for this F
    const worldMatrix = m4.yRotation(angle)
    const worldViewProjectionMatrix = m4.multiply(
      viewProjectionMatrix,
      worldMatrix
    )
    const worldInverseMatrix = m4.inverse(worldMatrix)
    const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

    // Set the matrices
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix)
    gl.uniformMatrix4fv(
      worldViewProjectionLocation,
      false,
      worldViewProjectionMatrix
    )
    gl.uniformMatrix4fv(
      worldInverseTransposeLocation,
      false,
      worldInverseTransposeMatrix
    )

    // Set the colour to use
    gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]) // green

    // Set the light position
    const lightPosition: Vec3 = [20, 30, 80]
    gl.uniform3fv(lightWorldPositionLocation, lightPosition)

    // point the spotlight at the F
    const lmat = [
      m4.lookAt(lightPosition, target, up()),
      m4.xRotation(lightRotationX),
      m4.yRotation(lightRotationY)
    ].reduce(m4.multiply)

    const lightDirection = [-lmat[8], -lmat[9], -lmat[10]]
    gl.uniform3fv(lightDirectionLocation, lightDirection)
    gl.uniform1f(innerLimitLocation, Math.cos(innerLimit))
    gl.uniform1f(outerLimitLocation, Math.cos(outerLimit))

    // Set the camera/view position
    gl.uniform3fv(viewWorldPositionLocation, camera)

    gl.uniform1f(shininessLocation, shininess)

    gl.uniform3fv(lightColorLocation, normalise([1, 0.6, 0.6]))
    gl.uniform3fv(specularColorLocation, normalise([1, 0.2, 0.2]))

    // Draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 16 * 6
    gl.drawArrays(primitiveType, offset, count)

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

  function setNormals(gl: WebGL2RenderingContext) {
    // prettier-ignore
    const normals = new Float32Array([
      // left column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // top rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // middle rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // left column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // middle rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // top rung right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // under top rung
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // between top rung and middle
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // top of middle rung
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // right of middle rung
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom of middle rung.
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // right of bottom
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
  }
}

main()
