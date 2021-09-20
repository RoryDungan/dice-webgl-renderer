export const observeAndResizeCanvas = (
  canvas: HTMLCanvasElement,
  initialSize: [number, number]
): CanvasResizer => {
  // init with the default canvas size
  const canvasToDisplaySizeMap: Map<Element, number[]> = new Map([
    [canvas, initialSize],
  ])

  const onResize = (entries: any[]) => {
    for (const entry of entries) {
      let width
      let height
      let dpr = window.devicePixelRatio
      if (entry.devicePixelContentBoxSize) {
        // NOTE: Only this path gives the correct answer
        // The other paths are imperfect fallbacks
        // for browsers that don't provide anyway to do this
        width = entry.devicePixelContentBoxSize[0].inlineSize
        height = entry.devicePixelContentBoxSize[0].blockSize
        dpr = 1 // it's already in width and height
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize
          height = entry.contentBoxSize[0].blockSize
        } else {
          width = entry.contentBoxSize.inlineSize
          height = entry.contentBoxSize.blockSize
        }
      } else {
        width = entry.contentRect.width
        height = entry.contentRect.height
      }
      const displayWidth = Math.round(width * dpr)
      const displayHeight = Math.round(height * dpr)
      canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight])
    }
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas, { box: 'content-box' })

  const resizeCanvasToDisplaySize = (): boolean => {
    // Get the size the browser is displaying the canvas in device pixels.
    const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas)

    // Check if the canvas is not the same size.
    const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight

    if (needResize) {
      // Make the canvas the same size
      canvas.width = displayWidth
      canvas.height = displayHeight
    }
    return needResize
  }

  return { resizeCanvasToDisplaySize }
}

export type CanvasResizer = {
  resizeCanvasToDisplaySize: () => boolean
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

const createProgram = (
  gl: WebGL2RenderingContext,
  shaders: [WebGLShader, WebGLShader]
): WebGLProgram => {
  const [vertexShader, fragmentShader] = shaders

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

export const createProgramFromSources = (
  gl: WebGL2RenderingContext,
  sources: [string, string]
): WebGLProgram => {
  const [vert, frag] = sources
  return createProgram(gl, [
    createShader(gl, gl.VERTEX_SHADER, vert),
    createShader(gl, gl.FRAGMENT_SHADER, frag),
  ])
}
