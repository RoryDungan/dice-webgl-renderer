import { Arrays } from 'twgl.js'

// type WebGLObject = {
//   position: Vec3[]
//   texcoord: Vec2[]
//   normal: Vec3[]
// }

export const parseObj = (text: string): Arrays => {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]]
  const objTexcoords = [[0, 0]]
  const objNormals = [[0, 0, 0]]

  // Same order as `f` indices
  const objVertexData = [objPositions, objTexcoords, objNormals]

  const webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
  ]

  const addVertex = (vert) => {
    const ptn = vert.split('/')
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return
      }

      const objIndex = parseInt(objIndexStr)
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length)
      webglVertexData[i].push(...objVertexData[i][index])
    })
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat))
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat))
    },
    vt(parts) {
      objTexcoords.push(parts.map(parseFloat))
    },
    f(parts) {
      const numTriangles = parts.length - 2
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0])
        addVertex(parts[tri + 1])
        addVertex(parts[tri + 2])
      }
    },
  }

  const keywordRE = /(\w*)(?: )*(.*)/
  const lines = text.split('\n')
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim()
    if (line === '' || line.startsWith('#')) {
      continue
    }
    // const parts = line.split(/\s+/)
    const m = keywordRE.exec(line)
    if (!m) {
      continue
    }
    const [, keyword, unparsedArgs] = m
    const parts = line.split(/\s+/).slice(1)
    const handler = keywords[keyword]
    if (!handler) {
      console.warn(`unhandled keyword: ${keyword} at line ${lineNo + 1}`)
      continue
    }
    handler(parts, unparsedArgs)
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
  }
}

export const loadObj = async (url: string): Promise<Arrays> => {
  const objData = await fetch(url)
  const objText = await objData.text()
  return parseObj(objText)
}
