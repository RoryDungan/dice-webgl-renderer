(()=>{"use strict";var e={505:e=>{e.exports="#version 300 es\n\n// an attribute is an input (in) to a vertex shader.\n// It will receive data from a buffer\nin vec2 a_position;\n\nuniform mat3 u_matrix;\n\n// all shaders have a main function\nvoid main() {\n    // Multiply the position by the matrix\n\n    // gl_Position is a special variable a vertex shader\n    // is responsible for setting\n    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);\n}\n"},667:e=>{e.exports="#version 300 es\n\nprecision highp float;\n\nuniform vec4 u_color;\n\n// we need to declare an output for the fragment shader\nout vec4 outColor;\n\nvoid main() {\n  outColor = u_color;\n}\n"}},n={};function t(r){var a=n[r];if(void 0!==a)return a.exports;var o=n[r]={exports:{}};return e[r](o,o.exports,t),o.exports}(()=>{var e=t(505),n=t(667);const r=(e,n,t)=>{const r=e.createShader(n);if(e.shaderSource(r,t),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)},a=function(){const e={};return window.hackedParams&&Object.keys(window.hackedParams).forEach((function(n){e[n]=window.hackedParams[n]})),window.location.search&&window.location.search.substring(1).split("&").forEach((function(n){const t=n.split("=").map((function(e){return decodeURIComponent(e)}));e[t[0]]=t[1]})),e}();function o(e,n){const t=document.querySelector(e);if(!t)return;const r=document.createElement("div");return t.appendChild(r),function(e,n){const t=n.precision||0;let r=n.min||0;const o=n.step||1;let i=n.value||0,c=n.max||1;const s=n.slide,d=a["ui-"+n.name]||n.name,u=void 0===n.uiPrecision?t:n.uiPrecision,l=n.uiMult||1;r/=o,c/=o,i/=o,e.innerHTML=`\n      <div class="gman-widget-outer">\n        <div class="gman-widget-label">${d}</div>\n        <div class="gman-widget-value"></div>\n        <input class="gman-widget-slider" type="range" min="${r}" max="${c}" value="${i}" />\n      </div>\n    `;const m=e.querySelector(".gman-widget-value"),h=e.querySelector(".gman-widget-slider");function v(e){m.textContent=(e*o*l).toFixed(u)}function p(e){const n=parseInt(e.target.value);v(n),s(e,{value:n*o})}return v(i),h.addEventListener("input",p),h.addEventListener("change",p),{elem:e,updateValue:e=>{e/=o,h.value=String(e),v(e)}}}(r,n)}const i=(e,n)=>{const t=e[0],r=e[1],a=e[2],o=e[3],i=e[4],c=e[5],s=e[6],d=e[7],u=e[8],l=n[0],m=n[1],h=n[2],v=n[3],p=n[4],g=n[5],f=n[6],x=n[7],w=n[8];return[l*t+m*o+h*s,l*r+m*i+h*d,l*a+m*c+h*u,v*t+p*o+g*s,v*r+p*i+g*d,v*a+p*c+g*u,f*t+x*o+w*s,f*r+x*i+w*d,f*a+x*c+w*u]},c=(e,n)=>[1,0,0,0,1,0,e,n,1],s=e=>{const n=Math.cos(e),t=Math.sin(e);return[n,-t,0,t,n,0,0,0,1]};(()=>{const t=document.querySelector("#c"),a=t.getContext("webgl2");if(!a)return console.error("Couldn't activate webgl2 context"),void(e=>{const n=document.createElement("div");n.className="error";const t=document.createElement("p");t.appendChild(document.createTextNode("Sorry, your browser doesn't seem to support WebGL 2 :(")),n.appendChild(t);const r=document.createElement("p");r.appendChild(document.createTextNode("Try running in the latest Firefox or Chrome.")),n.appendChild(r),e.appendChild(n)})(t.parentElement);const d=((e,n)=>{const[t,a]=n;return((e,n)=>{const[t,r]=n,a=e.createProgram();if(e.attachShader(a,t),e.attachShader(a,r),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS))return a;console.log(e.getProgramInfoLog(a)),e.deleteProgram(a)})(e,[r(e,e.VERTEX_SHADER,t),r(e,e.FRAGMENT_SHADER,a)])})(a,[e,n]),u=a.getAttribLocation(d,"a_position"),l=a.getUniformLocation(d,"u_color"),m=a.getUniformLocation(d,"u_matrix"),h=a.createBuffer(),v=a.createVertexArray();a.bindVertexArray(v),a.enableVertexAttribArray(u),a.bindBuffer(a.ARRAY_BUFFER,h),function(e){e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,30,0,0,150,0,150,30,0,30,150,30,0,100,0,30,30,30,30,100,0,100,30,30,60,67,60,30,90,30,90,67,60,67,90]),e.STATIC_DRAW)}(a);const p=a.FLOAT;a.vertexAttribPointer(u,2,p,!1,0,0);const g=[150,100];let f=0;const x=[1,1],w=[Math.random(),Math.random(),Math.random(),1];function A(e){return(n,t)=>{g[e]=t.value,_()}}function S(e){return(n,t)=>{x[e]=t.value,_()}}function _(){((e,n)=>{n=n||1;const t=e.clientWidth*n|0,r=e.clientHeight*n|0;(e.width!==t||e.height!==r)&&(e.width=t,e.height=r)})(a.canvas,window.devicePixelRatio),a.viewport(0,0,a.canvas.width,a.canvas.height),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),a.useProgram(d),a.bindVertexArray(v);const e=(u=a.canvas.clientWidth,h=a.canvas.clientHeight,[2/u,0,0,0,-2/h,0,-1,1,1]),n=c(-50,-75),t=[e,c(g[0],g[1]),s(f),(r=x[0],o=x[1],[r,0,0,0,o,0,0,0,1]),n].reduce(i);var r,o,u,h;a.uniformMatrix3fv(m,!1,t),a.uniform4fv(l,w);const p=a.TRIANGLES;a.drawArrays(p,0,18)}_(),o("#ui",{name:"x",slide:A(0),max:a.canvas.width}),o("#ui",{name:"y",slide:A(1),max:a.canvas.height}),o("#ui",{name:"r",slide:function(e,n){const t=360-n.value;f=Math.PI/180*t,_()},max:360}),o("#ui",{name:"scaleX",value:x[0],slide:S(0),min:-5,max:5,step:.01,precision:2}),o("#ui",{name:"scaleY",value:x[1],slide:S(1),min:-5,max:5,step:.01,precision:2})})()})()})();
//# sourceMappingURL=2d-translation.bundle.js.map