import vertexShaderSource from './shaders/helloworld.vert'
import fragmentShaderSource from './shaders/helloworld.frag'
import { createProgramFromSources, observeAndResizeCanvas } from './webglUtils'

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

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer()

  // Bind it to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // three 2d points
  const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Create a vertex array object
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // turn it on
  gl.enableVertexAttribArray(positionAttributeLocation)

  // tell the attribute how to get data out of positionBuffer
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

  // resize canvas
  const resizer = observeAndResizeCanvas(gl.canvas, [300, 150])

  const drawScene = () => {
    resizer.resizeCanvasToDisplaySize()

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // Pass in the canvas resolution so we can convert from pizels to clip space in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao)

    // draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 6
    gl.drawArrays(primitiveType, offset, count)

    requestAnimationFrame(drawScene)
  }

  requestAnimationFrame(drawScene)
}

main()
