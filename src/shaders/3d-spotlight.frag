#version 300 es

precision highp float;

// the varied normal passed from the vertex shader
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
uniform vec3 u_lightDirection;
uniform float u_innerLimit; // in dot space
uniform float u_outerLimit; // in dot space

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalising it
  // will make it a unit vector again.
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);
  // inLight will be 1 if we're inside the spotlight and 0 if not
  // float limitRange = u_innerLimit - u_outerLimit;
  // float inLight = clamp((dotFromDirection - u_outerLimit) / limitRange, 0.0, 1.0);
  float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);
  float light = inLight * dot(normal, surfaceToLightDirection);
  float specular = inLight * max(0.0, pow(dot(normal, halfVector), u_shininess));

  outColor = u_color;

  // Let's multiply just the color portion (not the alpha)
  // by the light.
  outColor.rgb *= light * u_lightColor;

  // Just add in the specular
  outColor.rgb += specular * u_specularColor;
}
