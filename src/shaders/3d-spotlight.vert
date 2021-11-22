#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

// a varying the color to the fragment shader
out vec3 v_normal;

out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

// all shaders have a main function
void main() {
  // Divide x and y by z
  gl_Position = u_worldViewProjection * a_position;

  // Pass the normal to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // compute the world position of the surface
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // compute the vector of the surface to the light
  // and pass it to the fragment shader
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // compute the vector of the surface to the view/camera 
  // and pass it to the fragment shader
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
