(()=>{"use strict";var e={967:e=>{e.exports="#version 300 es\n\nprecision highp float;\n\n// the varied color passed from the vertex shader\nin vec4 v_color;\n\n// we need to declare an output for the fragment shader\nout vec4 outColor;\n\nvoid main() {\n  outColor = v_color;\n}\n"},332:e=>{e.exports="#version 300 es\n\n// an attribute is an input (in) to a vertex shader.\n// It will receive data from a buffer\nin vec4 a_position;\nin vec4 a_color;\n\n// A matrix to transform the positions by\nuniform mat4 u_matrix;\n\n// a varying the color to the fragment shader\nout vec4 v_color;\n\n// all shaders have a main function\nvoid main() {\n  // Divide x and y by z\n  gl_Position = u_matrix * a_position;\n\n  // Pass the color to the fragment shader.\n  v_color = a_color;\n}\n"}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}(()=>{var e=n(332),t=n(967);const r=(e,t,n)=>{const r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)},o=function(){const e={};return window.hackedParams&&Object.keys(window.hackedParams).forEach((function(t){e[t]=window.hackedParams[t]})),window.location.search&&window.location.search.substring(1).split("&").forEach((function(t){const n=t.split("=").map((function(e){return decodeURIComponent(e)}));e[n[0]]=n[1]})),e}();const a=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],i=e=>{const t=(e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]))(e);return t>1e-5?[e[0]/t,e[1]/t,e[2]/t]:[0,0,0]},c=(e,t,n)=>[1,0,0,0,0,1,0,0,0,0,1,0,e,t,n,1],s=(e,t)=>{const n=t[0],r=t[1],o=t[2],a=t[3],i=t[4],c=t[5],s=t[6],d=t[7],l=t[8],u=t[9],h=t[10],m=t[11],v=t[12],f=t[13],g=t[14],p=t[15],A=e[0],x=e[1],_=e[2],w=e[3],E=e[4],b=e[5],P=e[6],S=e[7],R=e[8],T=e[9],y=e[10],F=e[11],C=e[12],I=e[13],M=e[14],L=e[15];return[n*A+r*E+o*R+a*C,n*x+r*b+o*T+a*I,n*_+r*P+o*y+a*M,n*w+r*S+o*F+a*L,i*A+c*E+s*R+d*C,i*x+c*b+s*T+d*I,i*_+c*P+s*y+d*M,i*w+c*S+s*F+d*L,l*A+u*E+h*R+m*C,l*x+u*b+h*T+m*I,l*_+u*P+h*y+m*M,l*w+u*S+h*F+m*L,v*A+f*E+g*R+p*C,v*x+f*b+g*T+p*I,v*_+f*P+g*y+p*M,v*w+f*S+g*F+p*L]},d=(e,t)=>{const n=[0,0,0,0];for(let r=0;r<4;++r){n[r]=0;for(let o=0;o<4;++o)n[r]+=t[o]*e[4*o+r]}return n};(()=>{const n=document.querySelector("#c"),l=n.getContext("webgl2");if(!l)return void(e=>{const t=document.createElement("div");t.className="error";const n=document.createElement("p");n.appendChild(document.createTextNode("Sorry, your browser doesn't seem to support WebGL 2 :(")),t.appendChild(n);const r=document.createElement("p");r.appendChild(document.createTextNode("Try running in the latest Firefox or Chrome.")),t.appendChild(r),e.appendChild(t)})(n);const u=((e,t)=>{const[n,o]=t;return((e,t)=>{const[n,r]=t,o=e.createProgram();if(e.attachShader(o,n),e.attachShader(o,r),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS))return o;console.log(e.getProgramInfoLog(o)),e.deleteProgram(o)})(e,[r(e,e.VERTEX_SHADER,n),r(e,e.FRAGMENT_SHADER,o)])})(l,[e,t]),h=l.getAttribLocation(u,"a_position"),m=l.getAttribLocation(u,"a_color"),v=l.getUniformLocation(u,"u_matrix"),f=l.createBuffer(),g=l.createVertexArray();l.bindVertexArray(g),l.enableVertexAttribArray(h),l.bindBuffer(l.ARRAY_BUFFER,f),function(e){const t=new Float32Array([0,0,0,0,150,0,30,0,0,0,150,0,30,150,0,30,0,0,30,0,0,30,30,0,100,0,0,30,30,0,100,30,0,100,0,0,30,60,0,30,90,0,67,60,0,30,90,0,67,90,0,67,60,0,0,0,30,30,0,30,0,150,30,0,150,30,30,0,30,30,150,30,30,0,30,100,0,30,30,30,30,30,30,30,100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,60,30,30,30,30,30,30,0,30,60,0,30,60,30,30,60,0,67,60,30,30,60,30,30,60,0,67,60,0,67,60,30,67,60,0,67,90,30,67,60,30,67,60,0,67,90,0,67,90,30,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,150,30,30,90,30,30,90,0,30,150,0,30,150,30,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0]),n=s((e=>{const t=Math.cos(e),n=Math.sin(e);return[1,0,0,0,0,t,n,0,0,-n,t,0,0,0,0,1]})(Math.PI),c(-50,-75,-15));for(let e=0;e<t.length;e+=3){const r=d(n,[t[e+0],t[e+1],t[e+2],1]);t[e+0]=r[0],t[e+1]=r[1],t[e+2]=r[2]}e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}(l);const p=l.FLOAT;l.vertexAttribPointer(h,3,p,!1,0,0);const A=l.createBuffer();l.bindBuffer(l.ARRAY_BUFFER,A),function(e){const t=new Uint8Array([200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,200,70,120,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,80,70,200,70,200,210,70,200,210,70,200,210,70,200,210,70,200,210,70,200,210,200,200,70,200,200,70,200,200,70,200,200,70,200,200,70,200,200,70,210,100,70,210,100,70,210,100,70,210,100,70,210,100,70,210,100,70,210,160,70,210,160,70,210,160,70,210,160,70,210,160,70,210,160,70,70,180,210,70,180,210,70,180,210,70,180,210,70,180,210,70,180,210,100,70,210,100,70,210,100,70,210,100,70,210,100,70,210,100,70,210,76,210,100,76,210,100,76,210,100,76,210,100,76,210,100,76,210,100,140,210,80,140,210,80,140,210,80,140,210,80,140,210,80,140,210,80,90,130,110,90,130,110,90,130,110,90,130,110,90,130,110,90,130,110,160,160,220,160,160,220,160,160,220,160,160,220,160,160,220,160,160,220]);e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}(l),l.enableVertexAttribArray(m),l.vertexAttribPointer(m,3,l.UNSIGNED_BYTE,!0,0,0);const x=60*Math.PI/180;let _=0,w=1.2;let E=0;requestAnimationFrame((function e(t){const n=(t*=.001)-E;E=t,_+=w*n,((e,t)=>{t=t||1;const n=e.clientWidth*t|0,r=e.clientHeight*t|0;(e.width!==n||e.height!==r)&&(e.width=n,e.height=r)})(l.canvas,window.devicePixelRatio),l.enable(l.CULL_FACE),l.enable(l.DEPTH_TEST),l.viewport(0,0,l.canvas.width,l.canvas.height),l.clearColor(0,0,0,0),l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT),l.useProgram(u),l.bindVertexArray(g);const r=l.canvas.clientWidth/l.canvas.clientHeight,o=((e,t,n,r)=>{const o=Math.tan(.5*Math.PI-.5*e),a=1/(n-r);return[o/t,0,0,0,0,o,0,0,0,0,(n+r)*a,-1,0,0,n*r*a*2,0]})(x,r,1,2e3),d=[200,0,0],h=s((e=>{const t=Math.cos(e),n=Math.sin(e);return[t,0,-n,0,0,1,0,0,n,0,t,0,0,0,0,1]})(_),c(0,50,300)),m=((e,t,n)=>{const r=i((c=t,[(o=e)[0]-c[0],o[1]-c[1],o[2]-c[2]]));var o,c;const s=i(a(n,r)),d=i(a(r,s));return[s[0],s[1],s[2],0,d[0],d[1],d[2],0,r[0],r[1],r[2],0,e[0],e[1],e[2],1]})([h[12],h[13],h[14]],d,[0,1,0]),f=(e=>{const t=e[0],n=e[1],r=e[2],o=e[3],a=e[4],i=e[5],c=e[6],s=e[7],d=e[8],l=e[9],u=e[10],h=e[11],m=e[12],v=e[13],f=e[14],g=e[15],p=u*g,A=f*h,x=c*g,_=f*s,w=c*h,E=u*s,b=r*g,P=f*o,S=r*h,R=u*o,T=r*s,y=c*o,F=d*v,C=m*l,I=a*v,M=m*i,L=a*l,B=d*i,U=t*v,D=m*n,N=t*l,q=d*n,H=t*i,V=a*n,k=p*i+_*l+w*v-(A*i+x*l+E*v),O=A*n+b*l+R*v-(p*n+P*l+S*v),W=x*n+P*i+T*v-(_*n+b*i+y*v),Y=E*n+S*i+y*l-(w*n+R*i+T*l),G=1/(t*k+a*O+d*W+m*Y);return[G*k,G*O,G*W,G*Y,G*(A*a+x*d+E*m-(p*a+_*d+w*m)),G*(p*t+P*d+S*m-(A*t+b*d+R*m)),G*(_*t+b*a+y*m-(x*t+P*a+T*m)),G*(w*t+R*a+T*d-(E*t+S*a+y*d)),G*(F*s+M*h+L*g-(C*s+I*h+B*g)),G*(C*o+U*h+q*g-(F*o+D*h+N*g)),G*(I*o+D*s+H*g-(M*o+U*s+V*g)),G*(B*o+N*s+V*h-(L*o+q*s+H*h)),G*(I*u+B*f+C*c-(L*f+F*c+M*u)),G*(N*f+F*r+D*u-(U*u+q*f+C*r)),G*(U*c+V*f+M*r-(H*f+I*r+D*c)),G*(H*u+L*r+q*c-(N*c+V*u+B*r))]})(m),p=s(o,f);for(let e=0;e<5;++e){const t=e*Math.PI*2/5,n=200*Math.cos(t),r=200*Math.sin(t),o=s(p,c(n,0,r));l.uniformMatrix4fv(v,!1,o);const a=l.TRIANGLES,i=0,d=96;l.drawArrays(a,i,d)}requestAnimationFrame(e)})),function(e,t){const n=document.querySelector("#ui");if(!n)return;const r=document.createElement("div");n.appendChild(r),function(e,t){const n=t.precision||0;let r=t.min||0;const a=t.step||1;let i=t.value||0,c=t.max||1;const s=t.slide,d=o["ui-"+t.name]||t.name,l=void 0===t.uiPrecision?n:t.uiPrecision,u=t.uiMult||1;r/=a,c/=a,i/=a,e.innerHTML=`\n      <div class="gman-widget-outer">\n        <div class="gman-widget-label">${d}</div>\n        <div class="gman-widget-value"></div>\n        <input class="gman-widget-slider" type="range" min="${r}" max="${c}" value="${i}" />\n      </div>\n    `;const h=e.querySelector(".gman-widget-value"),m=e.querySelector(".gman-widget-slider");function v(e){h.textContent=(e*a*u).toFixed(l)}function f(e){const t=parseInt(e.target.value);v(t),s(e,{value:t*a})}v(i),m.addEventListener("input",f),m.addEventListener("change",f)}(r,t)}(0,{name:"rotationSpeed",slide:(e,t)=>{w=t.value},precision:2,step:.01,min:-5,max:5,value:w})})()})()})();
//# sourceMappingURL=3d-camera.bundle.js.map