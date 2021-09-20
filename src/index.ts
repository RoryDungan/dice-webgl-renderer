import vertexShaderSource from './shaders/helloworld.vert'
import fragmentShaderSource from './shaders/helloworld.frag'
import { observeAndResizeCanvas } from './webglUtils'

const canvas: HTMLCanvasElement = document.querySelector('#c')

const gl = canvas.getContext('webgl2')
if (!gl) {
  console.error("Couldn't activate webgl2 context")
}

const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)

const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

const program = createProgram(gl, vertexShader, fragmentShader)

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
const positionBuffer = gl.createBuffer()

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// three 2d points
const positions = [0, 0, 0, 0.5, 0.7, 0]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

gl.enableVertexAttribArray(positionAttributeLocation)

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

const resizer = observeAndResizeCanvas(gl.canvas, [300, 150])

// resize canvas
const drawScene = () => {
  resizer.resizeCanvasToDisplaySize()

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program)

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao)

  const primitiveType = gl.TRIANGLES
  gl.drawArrays(primitiveType, 0, 3)

  requestAnimationFrame(drawScene)
}

requestAnimationFrame(drawScene)
