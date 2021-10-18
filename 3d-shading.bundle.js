(()=>{"use strict";var e={944:e=>{e.exports="#version 300 es\n\nprecision highp float;\n\n// the varied normal passed from the vertex shader\nin vec3 v_normal;\nin vec3 v_surfaceToLight;\nin vec3 v_surfaceToView;\n\nuniform vec4 u_color;\nuniform float u_shininess;\nuniform vec3 u_lightColor;\nuniform vec3 u_specularColor;\n\n// we need to declare an output for the fragment shader\nout vec4 outColor;\n\nvoid main() {\n  // because v_normal is a varying it's interpolated\n  // so it will not be a unit vector. Normalising it\n  // will make it a unit vector again.\n  vec3 normal = normalize(v_normal);\n\n  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);\n  vec3 surfaceToViewDirection = normalize(v_surfaceToView);\n  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);\n\n  // compute the light by taking the dot product\n  // of the normal to the light's reverse direction\n  float light = dot(normal, surfaceToLightDirection);\n  float specular = max(0.0, pow(dot(normal, halfVector), u_shininess));\n\n  outColor = u_color;\n\n  // Let's multiply just the color portion (not the alpha)\n  // by the light.\n  outColor.rgb *= light * u_lightColor;\n\n  // Just add in the specular\n  outColor.rgb += specular * u_specularColor;\n}\n"},461:e=>{e.exports="#version 300 es\n\n// an attribute is an input (in) to a vertex shader.\n// It will receive data from a buffer\nin vec4 a_position;\nin vec3 a_normal;\n\nuniform vec3 u_lightWorldPosition;\nuniform vec3 u_viewWorldPosition;\n\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\nuniform mat4 u_worldInverseTranspose;\n\n// a varying the color to the fragment shader\nout vec3 v_normal;\n\nout vec3 v_surfaceToLight;\nout vec3 v_surfaceToView;\n\n// all shaders have a main function\nvoid main() {\n  // Divide x and y by z\n  gl_Position = u_worldViewProjection * a_position;\n\n  // Pass the normal to the fragment shader.\n  v_normal = mat3(u_worldInverseTranspose) * a_normal;\n\n  // compute the world position of the surface\n  vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n\n  // compute the vector of the surface to the light\n  // and pass it to the fragment shader\n  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;\n\n  // compute the vector of the surface to the view/camera \n  // and pass it to the fragment shader\n  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;\n}\n"}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={exports:{}};return e[o](i,i.exports,t),i.exports}(()=>{var e=t(461),n=t(944);const o=(e,n,t)=>{const o=e.createShader(n);if(e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))return o;const r=e.getShaderInfoLog(o);throw e.deleteShader(o),new Error(`Error compiling shader:\n${r}`)},r=function(){const e={};return window.hackedParams&&Object.keys(window.hackedParams).forEach((function(n){e[n]=window.hackedParams[n]})),window.location.search&&window.location.search.substring(1).split("&").forEach((function(n){const t=n.split("=").map((function(e){return decodeURIComponent(e)}));e[t[0]]=t[1]})),e}();function i(e,n){const t=document.querySelector(e);if(!t)return;const o=document.createElement("div");return t.appendChild(o),function(e,n){const t=n.precision||0;let o=n.min||0;const i=n.step||1;let a=n.value||0,c=n.max||1;const s=n.slide,u=r["ui-"+n.name]||n.name,l=void 0===n.uiPrecision?t:n.uiPrecision,d=n.uiMult||1;o/=i,c/=i,a/=i,e.innerHTML=`\n      <div class="gman-widget-outer">\n        <div class="gman-widget-label">${u}</div>\n        <div class="gman-widget-value"></div>\n        <input class="gman-widget-slider" type="range" min="${o}" max="${c}" value="${a}" />\n      </div>\n    `;const m=e.querySelector(".gman-widget-value"),h=e.querySelector(".gman-widget-slider");function f(e){m.textContent=(e*i*d).toFixed(l)}function v(e){const n=parseInt(e.target.value);f(n),s(e,{value:n*i})}return f(a),h.addEventListener("input",v),h.addEventListener("change",v),{elem:e,updateValue:e=>{e/=i,h.value=String(e),f(e)}}}(o,n)}const a=(e,n)=>[e[1]*n[2]-e[2]*n[1],e[2]*n[0]-e[0]*n[2],e[0]*n[1]-e[1]*n[0]],c=e=>{const n=(e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]))(e);return n>1e-5?[e[0]/n,e[1]/n,e[2]/n]:[0,0,0]},s=(e,n)=>{const t=n[0],o=n[1],r=n[2],i=n[3],a=n[4],c=n[5],s=n[6],u=n[7],l=n[8],d=n[9],m=n[10],h=n[11],f=n[12],v=n[13],g=n[14],p=n[15],_=e[0],w=e[1],T=e[2],A=e[3],P=e[4],L=e[5],x=e[6],b=e[7],E=e[8],C=e[9],y=e[10],S=e[11],R=e[12],F=e[13],U=e[14],I=e[15];return[t*_+o*P+r*E+i*R,t*w+o*L+r*C+i*F,t*T+o*x+r*y+i*U,t*A+o*b+r*S+i*I,a*_+c*P+s*E+u*R,a*w+c*L+s*C+u*F,a*T+c*x+s*y+u*U,a*A+c*b+s*S+u*I,l*_+d*P+m*E+h*R,l*w+d*L+m*C+h*F,l*T+d*x+m*y+h*U,l*A+d*b+m*S+h*I,f*_+v*P+g*E+p*R,f*w+v*L+g*C+p*F,f*T+v*x+g*y+p*U,f*A+v*b+g*S+p*I]},u=e=>{const n=e[0],t=e[1],o=e[2],r=e[3],i=e[4],a=e[5],c=e[6],s=e[7],u=e[8],l=e[9],d=e[10],m=e[11],h=e[12],f=e[13],v=e[14],g=e[15],p=d*g,_=v*m,w=c*g,T=v*s,A=c*m,P=d*s,L=o*g,x=v*r,b=o*m,E=d*r,C=o*s,y=c*r,S=u*f,R=h*l,F=i*f,U=h*a,I=i*l,V=u*a,M=n*f,D=h*t,W=n*l,B=u*t,k=n*a,q=i*t,H=p*a+T*l+A*f-(_*a+w*l+P*f),N=_*t+L*l+E*f-(p*t+x*l+b*f),z=w*t+x*a+C*f-(T*t+L*a+y*f),O=P*t+b*a+y*l-(A*t+E*a+C*l),$=1/(n*H+i*N+u*z+h*O);return[$*H,$*N,$*z,$*O,$*(_*i+w*u+P*h-(p*i+T*u+A*h)),$*(p*n+x*u+b*h-(_*n+L*u+E*h)),$*(T*n+L*i+y*h-(w*n+x*i+C*h)),$*(A*n+E*i+C*u-(P*n+b*i+y*u)),$*(S*s+U*m+I*g-(R*s+F*m+V*g)),$*(R*r+M*m+B*g-(S*r+D*m+W*g)),$*(F*r+D*s+k*g-(U*r+M*s+q*g)),$*(V*r+W*s+q*m-(I*r+B*s+k*m)),$*(F*d+V*v+R*c-(I*v+S*c+U*d)),$*(W*v+S*o+D*d-(M*d+B*v+R*o)),$*(M*c+q*v+U*o-(k*v+F*o+D*c)),$*(k*d+I*o+B*c-(W*c+q*d+V*o))]},l=(e,n)=>{const t=[0,0,0,0];for(let o=0;o<4;++o){t[o]=0;for(let r=0;r<4;++r)t[o]+=n[r]*e[4*r+o]}return t};(()=>{const t=document.querySelector("#c"),r=t.getContext("webgl2");if(!r)return void(e=>{const n=document.createElement("div");n.className="error";const t=document.createElement("p");t.appendChild(document.createTextNode("Sorry, your browser doesn't seem to support WebGL 2 :(")),n.appendChild(t);const o=document.createElement("p");o.appendChild(document.createTextNode("Try running in the latest Firefox or Chrome.")),n.appendChild(o),e.appendChild(n)})(t);const d=((e,n)=>{const[t,r]=n;return((e,n)=>{const[t,o]=n,r=e.createProgram();if(e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS))return r;const i=e.getProgramInfoLog(r);throw e.deleteProgram(r),new Error(`Error creating program:\n${i}`)})(e,[o(e,e.VERTEX_SHADER,t),o(e,e.FRAGMENT_SHADER,r)])})(r,[e,n]),m=r.getAttribLocation(d,"a_position"),h=r.getAttribLocation(d,"a_normal"),f=r.getUniformLocation(d,"u_worldViewProjection"),v=r.getUniformLocation(d,"u_worldInverseTranspose"),g=r.getUniformLocation(d,"u_color"),p=r.getUniformLocation(d,"u_lightWorldPosition"),_=r.getUniformLocation(d,"u_viewWorldPosition"),w=r.getUniformLocation(d,"u_world"),T=r.getUniformLocation(d,"u_shininess"),A=r.getUniformLocation(d,"u_lightColor"),P=r.getUniformLocation(d,"u_specularColor"),L=r.createBuffer(),x=r.createVertexArray();r.bindVertexArray(x),r.enableVertexAttribArray(m),r.bindBuffer(r.ARRAY_BUFFER,L),function(e){const n=new Float32Array([0,0,0,0,150,0,30,0,0,0,150,0,30,150,0,30,0,0,30,0,0,30,30,0,100,0,0,30,30,0,100,30,0,100,0,0,30,60,0,30,90,0,67,60,0,30,90,0,67,90,0,67,60,0,0,0,30,30,0,30,0,150,30,0,150,30,30,0,30,30,150,30,30,0,30,100,0,30,30,30,30,30,30,30,100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,60,30,30,30,30,30,30,0,30,60,0,30,60,30,30,60,0,67,60,30,30,60,30,30,60,0,67,60,0,67,60,30,67,60,0,67,90,30,67,60,30,67,60,0,67,90,0,67,90,30,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,150,30,30,90,30,30,90,0,30,150,0,30,150,30,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0]),t=s((e=>{const n=Math.cos(e),t=Math.sin(e);return[1,0,0,0,0,n,t,0,0,-t,n,0,0,0,0,1]})(Math.PI),[1,0,0,0,0,1,0,0,0,0,1,0,-50,-75,-15,1]);for(let e=0;e<n.length;e+=3){const o=l(t,[n[e+0],n[e+1],n[e+2],1]);n[e+0]=o[0],n[e+1]=o[1],n[e+2]=o[2]}e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW)}(r),r.vertexAttribPointer(m,3,r.FLOAT,!1,0,0);const b=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,b),r.enableVertexAttribArray(h),r.vertexAttribPointer(h,3,r.FLOAT,!1,0,0),function(e){const n=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0]);e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW)}(r);const E=60*Math.PI/180;let C=1.2,y=0,S=150,R=0;requestAnimationFrame((function e(n){const t=(n*=.001)-R;R=n,y+=C*t,((e,n)=>{n=n||1;const t=e.clientWidth*n|0,o=e.clientHeight*n|0;(e.width!==t||e.height!==o)&&(e.width=t,e.height=o)})(r.canvas,window.devicePixelRatio),r.enable(r.CULL_FACE),r.enable(r.DEPTH_TEST),r.viewport(0,0,r.canvas.width,r.canvas.height),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.useProgram(d),r.bindVertexArray(x);const o=r.canvas.clientWidth/r.canvas.clientHeight,i=((e,n,t,o)=>{const r=Math.tan(.5*Math.PI-.5*e),i=1/(t-o);return[r/n,0,0,0,0,r,0,0,0,0,(t+o)*i,-1,0,0,t*o*i*2,0]})(E,o,1,2e3),l=[100,150,200],m=((e,n,t)=>{const o=c((i=n,[(r=e)[0]-i[0],r[1]-i[1],r[2]-i[2]]));var r,i;const s=c(a(t,o)),u=c(a(o,s));return[s[0],s[1],s[2],0,u[0],u[1],u[2],0,o[0],o[1],o[2],0,e[0],e[1],e[2],1]})(l,[0,35,0],[0,1,0]),h=u(m),L=s(i,h),b=(e=>{const n=Math.cos(e),t=Math.sin(e);return[n,0,-t,0,0,1,0,0,t,0,n,0,0,0,0,1]})(y),F=s(L,b),U=u(b),I=[(V=U)[0],V[4],V[8],V[12],V[1],V[5],V[9],V[13],V[2],V[6],V[10],V[14],V[2],V[7],V[11],V[15]];var V;r.uniformMatrix4fv(w,!1,b),r.uniformMatrix4fv(f,!1,F),r.uniformMatrix4fv(v,!1,I),r.uniform4fv(g,[.2,1,.2,1]),r.uniform3fv(p,[20,30,50]),r.uniform3fv(_,l),r.uniform1f(T,S),r.uniform3fv(A,c([1,.6,.6])),r.uniform3fv(P,c([1,.2,.2]));const M=r.TRIANGLES;r.drawArrays(M,0,96),requestAnimationFrame(e)})),i("#ui",{name:"rotationSpeed",slide:(e,n)=>{C=n.value},precision:2,step:.01,min:-5,max:5,value:C}),i("#ui",{name:"shininess",slide:(e,n)=>{S=n.value},precision:2,step:.01,min:1,max:300,value:S})})()})()})();
//# sourceMappingURL=3d-shading.bundle.js.map