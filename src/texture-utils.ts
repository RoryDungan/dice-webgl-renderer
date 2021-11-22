/*
 * Copyright 2021, GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

const ctx = document.createElement('canvas').getContext('2d')

const setCanvasSize = function (width, height) {
  ctx.canvas.width = width
  ctx.canvas.height = height
}

const makeTexture = function (gl: WebGL2RenderingContext) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    ctx.canvas
  )
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return tex
}

type OptionsType = {
  width?: number
  height?: number
  color1?: string
  color2?: string
  min?: number
  max?: number
}

const makeStripeTexture = function (
  gl: WebGL2RenderingContext,
  options: OptionsType
): WebGLTexture {
  options = options || {}
  const width = options.width || 2
  const height = options.height || 2
  const color1 = options.color1 || 'white'
  const color2 = options.color2 || 'black'

  setCanvasSize(width, height)

  ctx.fillStyle = color1 || 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color2 || 'black'
  ctx.fillRect(0, 0, width, height / 2)

  return makeTexture(gl)
}

const makeCheckerTexture = function (
  gl: WebGL2RenderingContext,
  options: OptionsType
): WebGLTexture {
  options = options || {}
  const width = options.width || 2
  const height = options.height || 2
  const color1 = options.color1 || 'white'
  const color2 = options.color2 || 'black'

  setCanvasSize(width, height)

  ctx.fillStyle = color1 || 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color2 || 'black'
  ctx.fillRect(0, 0, width / 2, height / 2)
  ctx.fillRect(width / 2, height / 2, width / 2, height / 2)

  return makeTexture(gl)
}

const makeCircleTexture = function (
  gl: WebGL2RenderingContext,
  options: OptionsType
): WebGLTexture {
  options = options || {}
  const width = options.width || 128
  const height = options.height || 128
  const color1 = options.color1 || 'white'
  const color2 = options.color2 || 'black'

  setCanvasSize(width, height)

  ctx.fillStyle = color1 || 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color2 || 'black'
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.beginPath()
  ctx.arc(0, 0, width / 2 - 1, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = color1 || 'white'
  ctx.beginPath()
  ctx.arc(0, 0, width / 4 - 1, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  return makeTexture(gl)
}

const rand = function (min: number, max?: number) {
  if (max === undefined) {
    max = min
    min = 0
  }
  return min + Math.random() * (max - min)
}

const makeRandomTexture = function (
  gl: WebGL2RenderingContext,
  options: OptionsType
): WebGLTexture {
  options = options || {}
  const w = options.width || 2
  const h = options.height || 2
  const min = options.min || 0
  const max = options.max || 256

  const numPixels = w * h
  const pixels = new Uint8Array(numPixels * 4)
  for (let p = 0; p < numPixels; ++p) {
    const off = p * 4
    pixels[off + 0] = rand(min, max)
    pixels[off + 1] = rand(min, max)
    pixels[off + 2] = rand(min, max)
    pixels[off + 3] = 255
  }
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    w,
    h,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels
  )
  gl.generateMipmap(gl.TEXTURE_2D)
  return texture
}

export const textureUtils = {
  makeStripeTexture: makeStripeTexture,
  makeCheckerTexture: makeCheckerTexture,
  makeCircleTexture: makeCircleTexture,
  makeRandomTexture: makeRandomTexture,
}
