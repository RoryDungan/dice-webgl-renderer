// prettier-ignore
export type Mat3 = [
  number, number, number,
  number, number, number,
  number, number, number,
]

// prettier-ignore
export type Mat4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180

export const radToDeg = (radians: number): number => (radians * 180) / Math.PI

export const m3 = {
  multiply: (a: Mat3, b: Mat3): Mat3 => {
    const a00 = a[0 * 3 + 0]
    const a01 = a[0 * 3 + 1]
    const a02 = a[0 * 3 + 2]
    const a10 = a[1 * 3 + 0]
    const a11 = a[1 * 3 + 1]
    const a12 = a[1 * 3 + 2]
    const a20 = a[2 * 3 + 0]
    const a21 = a[2 * 3 + 1]
    const a22 = a[2 * 3 + 2]
    const b00 = b[0 * 3 + 0]
    const b01 = b[0 * 3 + 1]
    const b02 = b[0 * 3 + 2]
    const b10 = b[1 * 3 + 0]
    const b11 = b[1 * 3 + 1]
    const b12 = b[1 * 3 + 2]
    const b20 = b[2 * 3 + 0]
    const b21 = b[2 * 3 + 1]
    const b22 = b[2 * 3 + 2]

    // prettier-ignore
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },

  // prettier-ignore
  translation: (tx: number, ty: number): Mat3 => [
    1, 0, 0,
    0, 1, 0,
    tx,ty,1,
  ],

  rotation: (angleRads: number): Mat3 => {
    const c = Math.cos(angleRads)
    const s = Math.sin(angleRads)
    // prettier-ignore
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ]
  },

  // prettier-ignore
  scaling: (sx: number, sy: number): Mat3 => [
    sx, 0, 0,
     0,sy, 0,
     0, 0, 1,
  ],

  // prettier-ignore
  identity: (): Mat3 => [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ],

  // Note: this matrix flips the Y axis so that 0 is at the top.
  // prettier-ignore
  projection: (width: number, height: number): Mat3 => [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ],
}

export const m4 = {
  // prettier-ignore
  translation: (tx: number, ty: number, tz: number): Mat4 => [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0,  1,  0,
    tx, ty, tz, 1
  ],

  xRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    // prettier-ignore
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ]
  },

  yRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    // prettier-ignore
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ]
  },

  zRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    // prettier-ignore
    return [
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
  },

  // prettier-ignore
  scaling: (sx: number, sy: number, sz: number): Mat4 => [
    sx, 0,  0,  0,
    0, sy,  0,  0,
    0,  0, sz,  0,
    0,  0,  0,  1
  ],

  multiply: (a: Mat4, b: Mat4): Mat4 => {
    const b00 = b[0 * 4 + 0]
    const b01 = b[0 * 4 + 1]
    const b02 = b[0 * 4 + 2]
    const b03 = b[0 * 4 + 3]
    const b10 = b[1 * 4 + 0]
    const b11 = b[1 * 4 + 1]
    const b12 = b[1 * 4 + 2]
    const b13 = b[1 * 4 + 3]
    const b20 = b[2 * 4 + 0]
    const b21 = b[2 * 4 + 1]
    const b22 = b[2 * 4 + 2]
    const b23 = b[2 * 4 + 3]
    const b30 = b[3 * 4 + 0]
    const b31 = b[3 * 4 + 1]
    const b32 = b[3 * 4 + 2]
    const b33 = b[3 * 4 + 3]
    const a00 = a[0 * 4 + 0]
    const a01 = a[0 * 4 + 1]
    const a02 = a[0 * 4 + 2]
    const a03 = a[0 * 4 + 3]
    const a10 = a[1 * 4 + 0]
    const a11 = a[1 * 4 + 1]
    const a12 = a[1 * 4 + 2]
    const a13 = a[1 * 4 + 3]
    const a20 = a[2 * 4 + 0]
    const a21 = a[2 * 4 + 1]
    const a22 = a[2 * 4 + 2]
    const a23 = a[2 * 4 + 3]
    const a30 = a[3 * 4 + 0]
    const a31 = a[3 * 4 + 1]
    const a32 = a[3 * 4 + 2]
    const a33 = a[3 * 4 + 3]

    // prettier-ignore
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ]
  },

  // prettier-ignore
  orthographic: (left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 => [
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, 2 / (near - far), 0,

    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    (near + far) / (near - far),
    1,
  ],

  perspective: (
    fieldOfViewRadians: number,
    aspect: number,
    near: number,
    far: number
  ): Mat4 => {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadians)
    const rangeInv = 1 / (near - far)

    // prettier-ignore
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ]
  },
}
