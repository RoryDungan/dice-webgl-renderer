import * as twgl from 'twgl.js'
import { m4 } from 'twgl.js'
import vs from './shaders/twgl-test.vert'
import fs from './shaders/twgl-test.frag'
import { degToRad } from './math'
import { textureUtils } from './texture-utils'
import * as chroma from 'chroma-js'

function main() {
  // Get A WebGL context
  const canvas: HTMLCanvasElement = document.querySelector('#c')
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    return
  }

  const buffers: any = twgl.primitives.createSphereBuffers(gl, 10, 48, 24)

  // setup GLSL program
  const program = twgl.createProgramFromSources(gl, [vs, fs])
  const uniformSetters = twgl.createUniformSetters(gl, program)
  const attribSetters = twgl.createAttributeSetters(gl, program)

  const attribs = {
    a_position: { buffer: buffers.position, numComponents: 3 },
    a_normal: { buffer: buffers.normal, numComponents: 3 },
    a_texcoord: { buffer: buffers.texcoord, numComponents: 2 },
  }
  const vao = twgl.createVAOAndSetAttributes(
    gl,
    attribSetters,
    attribs,
    buffers.indices
  ) as unknown

  const fieldOfViewRadians = degToRad(60)

  const uniformsThatAreTheSameForAllObjects = {
    u_lightWorldPos: [-50, 30, 100],
    u_viewInverse: m4.identity(),
    u_lightColor: [1, 1, 1, 1],
  }

  const uniformsThatAreComputedForEachObject = {
    u_worldViewProjection: m4.identity(),
    u_world: m4.identity(),
    u_worldInverseTranspose: m4.identity(),
  }

  const rand = function (min: number, max?: number) {
    if (max === undefined) {
      max = min
      min = 0
    }
    return min + Math.random() * (max - min)
  }

  const randInt = function (range) {
    return Math.floor(Math.random() * range)
  }

  const textures = [
    textureUtils.makeStripeTexture(gl, { color1: '#FFF', color2: '#CCC' }),
    textureUtils.makeCheckerTexture(gl, { color1: '#FFF', color2: '#CCC' }),
    textureUtils.makeCircleTexture(gl, { color1: '#FFF', color2: '#CCC' }),
  ]

  const objects = []
  const numObjects = 300
  const baseColor = rand(240)
  for (let ii = 0; ii < numObjects; ++ii) {
    const color = chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl()
    objects.push({
      radius: rand(0, 150),
      xRotation: rand(0, Math.PI * 2),
      yRotation: rand(0, Math.PI),
      materialUniforms: {
        u_colorMult: color,
        u_diffuse: textures[randInt(textures.length)],
        u_specular: [1, 1, 1, 1],
        u_shininess: rand(500),
        u_specularFactor: rand(1),
      },
    })
  }

  requestAnimationFrame(drawScene)

  // Draw the scene.
  function drawScene(time) {
    time = 5 + time * 0.0001

    twgl.resizeCanvasToDisplaySize(gl.canvas)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    // Compute the projection matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000)

    // Compute the camera's matrix using look at.
    const cameraPosition = [0, 0, 100]
    const target = [0, 0, 0]
    const up = [0, 1, 0]
    const cameraMatrix = m4.lookAt(
      cameraPosition,
      target,
      up,
      uniformsThatAreTheSameForAllObjects.u_viewInverse
    )

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix)

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

    gl.useProgram(program)

    // Setup all the needed attributes.
    gl.bindVertexArray(vao)

    // Set the uniforms that are the same for all objects.
    twgl.setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects)

    // Draw objects
    objects.forEach(function (object) {
      // Compute a position for this object based on the time.
      let worldMatrix = m4.identity()
      worldMatrix = m4.rotateY(worldMatrix, object.yRotation * time)
      worldMatrix = m4.rotateX(worldMatrix, object.xRotation * time)
      worldMatrix = m4.translate(
        worldMatrix,
        [0, 0, object.radius],
        uniformsThatAreComputedForEachObject.u_world
      )

      // Multiply the matrices.
      m4.multiply(
        viewProjectionMatrix,
        worldMatrix,
        uniformsThatAreComputedForEachObject.u_worldViewProjection
      )
      m4.transpose(
        m4.inverse(worldMatrix),
        uniformsThatAreComputedForEachObject.u_worldInverseTranspose
      )

      // Set the uniforms we just computed
      twgl.setUniforms(uniformSetters, uniformsThatAreComputedForEachObject)

      // Set the uniforms that are specific to the this object.
      twgl.setUniforms(uniformSetters, object.materialUniforms)

      // Draw the geometry.
      gl.drawElements(gl.TRIANGLES, buffers.numElements, gl.UNSIGNED_SHORT, 0)
    })

    requestAnimationFrame(drawScene)
  }
}

main()
