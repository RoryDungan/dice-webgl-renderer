import { m4 } from 'twgl.js'
import vs from './shaders/3d-perspective.vert'
import fs from './shaders/scene-graph.frag'
import * as twgl from 'twgl.js'
import { showWebGLUnsupportedError } from './webglUtils'
import { flattenedPrimitives } from './flattened-primitives'
import { degToRad } from './math'

const Node = function (source) {
  this.children = []
  this.localMatrix = m4.identity()
  this.worldMatrix = m4.identity()
  this.source = source
}

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    const ndx = this.parent.children.indexOf(this)
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1)
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this)
  }
  this.parent = parent
}

Node.prototype.updateWorldMatrix = function (parentWorldMatrix) {
  if (parentWorldMatrix) {
    // a matrix was passed in so do the math and store the result in this.worldMatrix.
    m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix)
  } else {
    // no matrix was passed in so just copy
    m4.copy(this.localMatrix, this.worldMatrix)
  }

  const source = this.source
  if (source) {
    source.getMatrix(this.localMatrix)
  }

  // now process all the children
  const worldMatrix = this.worldMatrix
  this.children.forEach((child) => child.updateWorldMatrix(worldMatrix))
}

const TRS = function () {
  this.translation = [0, 0, 0]
  this.rotation = [0, 0, 0]
  this.scale = [1, 1, 1]
}

TRS.prototype.getMatrix = function (dst) {
  dst = dst || new Float32Array(16)
  const t = this.translation
  const r = this.rotation
  const s = this.scale

  // compute a matrix from translation, rotation and scale
  m4.translation(t, dst)
  m4.rotateX(dst, r[0], dst)
  m4.rotateY(dst, r[1], dst)
  m4.rotateZ(dst, r[2], dst)
  m4.scale(dst, s, dst)
  return dst
}

//////////////////////////////////

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
// setup GLSL program
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const sphereVAO = twgl.createVAOFromBufferInfo(
  gl,
  programInfo,
  sphereBufferInfo
) as unknown as WebGLVertexArrayObject

const fieldOfViewRadians = degToRad(60)

const solarSystemTRS = new TRS(),
  solarSystemNode = new Node(solarSystemTRS)
const sunTRS = new TRS(),
  sunNode = new Node(sunTRS)
sunTRS.scaling = [5, 5, 5]
sunNode.drawInfo = {
  uniforms: {
    u_colorOffset: [0.6, 0.6, 0, 1],
    u_colorMult: [0.4, 0.4, 0, 1],
  },
  programInfo,
  bufferInfo: sphereBufferInfo,
  vertexARray: sphereVAO,
}

const earthOrbitTRS = new TRS(),
  earthOrbitNode = new Node(earthOrbitTRS)
earthOrbitTRS.translation = [100, 0, 0]
const earthTRS = new TRS(),
  earthNode = new Node(earthTRS)
earthTRS.scaling = [2, 2, 2]
earthNode.drawInfo = {
  uniforms: {
    u_colorOffset: [0.2, 0.5, 0.8, 1],
    u_colorMult: [0.8, 0.5, 0.2, 1],
  },
  programInfo,
  bufferInfo: sphereBufferInfo,
  vertexARray: sphereVAO,
}

const moonOrbitTRS = new TRS(),
  moonOrbitNode = new Node(moonOrbitTRS)
moonOrbitTRS.translation = [30, 0, 0]
const moonTRS = new TRS(),
  moonNode = new Node(moonTRS)
moonTRS.scaling = [0.4, 0.4, 0.4]
moonNode.drawInfo = {
  uniforms: {
    u_colorOffset: [0.6, 0.6, 0.6, 1],
    u_colorMult: [0.1, 0.1, 0.1, 1],
  },
  programInfo,
  bufferInfo: sphereBufferInfo,
  vertexARray: sphereVAO,
}

sunNode.setParent(solarSystemNode)
earthOrbitNode.setParent(solarSystemNode)
earthNode.setParent(earthOrbitNode)
moonOrbitNode.setParent(earthOrbitNode)
moonNode.setParent(moonOrbitNode)

const objects = [sunNode, earthNode, moonNode]
const objectsToDraw = objects.map((o) => o.drawInfo)

const drawScene = () => {
  // time *= 0.001

  twgl.resizeCanvasToDisplaySize(gl.canvas)

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  // Clear the canvas and the depth buffer
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Compute the projection matrix
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000)

  const cameraPosition = [0, -200, 0],
    target = [0, 0, 0],
    up = [0, 0, 1],
    cameraMatrix = m4.lookAt(cameraPosition, target, up)

  // make a view matrix from the camera matrix.
  const viewMatrix = m4.inverse(cameraMatrix),
    viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

  // update the local matrices for each object
  earthOrbitTRS.rotation[1] += 0.01
  moonOrbitTRS.rotation[1] += 0.01
  // spin
  // m4.multiply(m4.rotationY(0.005), sunNode.localMatrix, sunNode.localMatrix)
  // m4.multiply(m4.rotationY(0.05), earthNode.localMatrix, earthNode.localMatrix)
  // m4.multiply(m4.rotationY(-0.01), moonNode.localMatrix, moonNode.localMatrix)

  solarSystemNode.updateWorldMatrix()

  // compute all the matrices for rendering
  objects.forEach(
    (obj) =>
      (obj.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        obj.worldMatrix
      ))
  )

  // Draw the objects
  twgl.drawObjectList(gl, objectsToDraw)

  requestAnimationFrame(drawScene)
}

requestAnimationFrame(drawScene)
