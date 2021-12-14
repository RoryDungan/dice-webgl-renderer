import vs from './shaders/directional-lighting.vert'
import fs from './shaders/directional-lighting.frag'
import cubeObj from './models/cube.obj'

import * as twgl from 'twgl.js'
import { showWebGLUnsupportedError } from './webglUtils'
import { degToRad, m4, normalise, up, Vec3 } from './math'
import { loadObj } from './obj-loader'

const main = async () => {
  // Get A WebGL context
  const canvas: HTMLCanvasElement = document.querySelector('#c')
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    showWebGLUnsupportedError(canvas)
    return
  }

  twgl.setAttributePrefix('a_')

  const meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs])

  const objData = await loadObj(cubeObj)

  // Because the data is already stored in arrays named position, texcoord & normal,
  // and those names match the attributes in our vertex shaders, we can pass it
  // directly into createBufferInfoFromArrays

  // Create a buffer for each array by calling
  // gl.createBuffer, gl.bindBuffer, gl.bufferData
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, objData)
  // fills out a vertex array by calling gl.createVertexArray, gl.bindVertexArray
  // then gl.bindBuffer, gl.enableVertexAttribArray, and gl.vertexAttribPointer for each attribute
  const vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo)

  const cameraTarget: Vec3 = [0, 0, 0]
  const cameraPosition: Vec3 = [0, 0, 4]
  const zNear = 0.1
  const zFar = 50

  let then = 0
  let angle = 0
  const rotationSpeed = 1

  const fieldOfViewRadians = degToRad(60)

  function drawScene(now: number) {
    // Convert the time to seconds
    now *= 0.001
    // Subtract the previous time from the current time
    const deltaTime = now - then
    // Remember the current time for the next frame
    then = now

    angle += rotationSpeed * deltaTime

    twgl.resizeCanvasToDisplaySize(gl.canvas)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)

    const camera = m4.lookAt(cameraPosition, cameraTarget, up())

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera)

    const sharedUniforms = {
      u_lightDirection: normalise([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
    }

    gl.useProgram(meshProgramInfo.program)

    // calls gl.uniform
    twgl.setUniforms(meshProgramInfo, sharedUniforms)

    // set the attributes for this part
    gl.bindVertexArray(vao as unknown as WebGLVertexArrayObject)

    // calls gl.uniform
    twgl.setUniforms(meshProgramInfo, {
      u_world: m4.yRotation(angle),
      u_diffuse: [1, 0.7, 0.5, 1],
    })

    twgl.drawBufferInfo(gl, bufferInfo)

    requestAnimationFrame(drawScene)
  }
  requestAnimationFrame(drawScene)
}

main().catch(console.error)
