import vs from './shaders/3d-perspective.vert'
import fs from './shaders/draw-multiple.frag'
import * as twgl from 'twgl.js'
import { m4 } from 'twgl.js'
import { showWebGLUnsupportedError } from './webglUtils'
import { flattenedPrimitives } from './flattened-primitives'
import { degToRad, emod, rand } from './math'
import * as chroma from 'chroma-js'

const canvas: HTMLCanvasElement = document.querySelector('#c')
const gl = canvas.getContext('webgl2')
if (!gl) {
  showWebGLUnsupportedError(canvas)
  throw new Error('Failed to create WebGL 2 context')
}

// Tell the twgl to match position with a_position, normal with a_normal, etc...
twgl.setAttributePrefix('a_')

const sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(
  gl,
  10,
  12,
  6
)
const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20)
const coneBufferInfo = flattenedPrimitives.createTruncatedConeBufferInfo(
  gl,
  10,
  0,
  20,
  12,
  1,
  true,
  false
)

// setup GLSL program
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const sphereVAO = twgl.createVAOFromBufferInfo(
  gl,
  programInfo,
  sphereBufferInfo
) as unknown as WebGLVertexArrayObject
const cubeVAO = twgl.createVAOFromBufferInfo(
  gl,
  programInfo,
  cubeBufferInfo
) as unknown as WebGLVertexArrayObject
const coneVAO = twgl.createVAOFromBufferInfo(
  gl,
  programInfo,
  coneBufferInfo
) as unknown as WebGLVertexArrayObject

const fieldOfViewRadians = degToRad(60)

const computeMatrix = (
  viewProjectionMatrix,
  translation,
  xRotation,
  yRotation
) => {
  let matrix = m4.translate(viewProjectionMatrix, translation)
  matrix = m4.rotateX(matrix, xRotation)
  return m4.rotateY(matrix, yRotation)
}

const shapes = [
  { bufferInfo: sphereBufferInfo, vertexArray: sphereVAO },
  { bufferInfo: cubeBufferInfo, vertexArray: cubeVAO },
  { bufferInfo: coneBufferInfo, vertexArray: coneVAO },
]

const baseHue = rand(360)
const numObjects = 200

const objects = [
  ...(function* () {
    for (let ii = 0; ii < numObjects; ++ii) {
      // make an object
      yield {
        uniforms: {
          u_colorMult: chroma
            .hsv(emod(baseHue + rand(120), 360), rand(0.5, 1), rand(0.5, 1))
            .gl(),
          u_matrix: m4.identity(),
        },
        translation: [rand(-100, 100), rand(-100, 100), rand(-150, -50)],
        xRotationSpeed: rand(-1.2, 1.2),
        yRotationSpeed: rand(-1.2, 1.2),
      }
    }
  })(),
]

const objectsToDraw = objects.map((obj) => {
  // pick a shape
  const shape = shapes[rand(shapes.length) | 0]

  return {
    programInfo,
    uniforms: obj.uniforms,
    ...shape,
  }
})

const drawScene = (time) => {
  time *= 0.0005

  twgl.resizeCanvasToDisplaySize(gl.canvas)

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  // Compute the projection matrix
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000)

  const cameraPosition = [0, 0, 100]
  const target = [0, 0, 0]
  const up = [0, 1, 0]
  const cameraMatrix = m4.lookAt(cameraPosition, target, up)

  // make a view matrix from the camera matrix.
  const viewMatrix = m4.inverse(cameraMatrix)

  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

  objects.forEach((obj) => {
    obj.uniforms.u_matrix = computeMatrix(
      viewProjectionMatrix,
      obj.translation,
      obj.xRotationSpeed * time,
      obj.yRotationSpeed * time
    )
  })

  // Draw the objects
  let lastUsedProgramInfo, lastUsedVertexArray
  objectsToDraw.forEach(
    ({ programInfo, vertexArray, uniforms, bufferInfo }) => {
      if (programInfo !== lastUsedProgramInfo) {
        gl.useProgram(programInfo.program)
        lastUsedProgramInfo = programInfo
      }

      if (vertexArray != lastUsedVertexArray) {
        gl.bindVertexArray(vertexArray)
        lastUsedVertexArray = vertexArray
      }

      // Set the uniforms
      twgl.setUniforms(programInfo, uniforms)

      // Draw
      twgl.drawBufferInfo(gl, bufferInfo)
    }
  )

  requestAnimationFrame(drawScene)
}

requestAnimationFrame(drawScene)
