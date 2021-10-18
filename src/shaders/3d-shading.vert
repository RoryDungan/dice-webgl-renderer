#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

// a varying the color to the fragment shader
out vec3 v_normal;

// all shaders have a main function
void main() {
  // Divide x and y by z
  gl_Position = u_worldViewProjection * a_position;

  // Pass the normal to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
