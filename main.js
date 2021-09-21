/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 667:
/***/ ((module) => {

module.exports = "#version 300 es\n\n// fragment shaders don't have a default precision so we need\n// to pick one. highp is a good default. It means \"high precision\"\nprecision highp float;\n\n// we need to declare an output for the fragment shader\nout vec4 outColor;\n\nvoid main() {\n    // Just set the output to a constant reddish-purple\n    outColor = vec4(1, 0, 0.5, 1);\n}\n";

/***/ }),

/***/ 279:
/***/ ((module) => {

module.exports = "#version 300 es\n\n// an attribute is an input (in) to a vertex shader.\n// It will receive data from a buffer\nin vec2 a_position;\n\nuniform vec2 u_resolution;\n\n// all shaders have a main function\nvoid main() {\n    // convert the position from pixels to 0.0 to 1.0\n    vec2 zeroToOne = a_position / u_resolution;\n\n    // convert from 0->1 to 0->2\n    vec2 zeroToTwo = zeroToOne * 2.0;\n\n    // convert from 0->2 to -1->+1 (clip space)\n    vec2 clipSpace = zeroToTwo - 1.0;\n\n    // gl_Position is a special variable a vertex shader\n    // is responsible for setting\n    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n}\n";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./src/shaders/helloworld.vert
var helloworld = __webpack_require__(279);
// EXTERNAL MODULE: ./src/shaders/helloworld.frag
var shaders_helloworld = __webpack_require__(667);
;// CONCATENATED MODULE: ./src/webglUtils.ts
const observeAndResizeCanvas = (canvas, initialSize) => {
    // init with the default canvas size
    const canvasToDisplaySizeMap = new Map([
        [canvas, initialSize],
    ]);
    const onResize = (entries) => {
        for (const entry of entries) {
            let width;
            let height;
            let dpr = window.devicePixelRatio;
            if (entry.devicePixelContentBoxSize) {
                // NOTE: Only this path gives the correct answer
                // The other paths are imperfect fallbacks
                // for browsers that don't provide anyway to do this
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1; // it's already in width and height
            }
            else if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                }
                else {
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            }
            else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas, { box: 'content-box' });
    const resizeCanvasToDisplaySize = () => {
        // Get the size the browser is displaying the canvas in device pixels.
        const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);
        // Check if the canvas is not the same size.
        const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
        if (needResize) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
        return needResize;
    };
    return { resizeCanvasToDisplaySize };
};
const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
};
const createProgram = (gl, shaders) => {
    const [vertexShader, fragmentShader] = shaders;
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
};
const createProgramFromSources = (gl, sources) => {
    const [vert, frag] = sources;
    return createProgram(gl, [
        createShader(gl, gl.VERTEX_SHADER, vert),
        createShader(gl, gl.FRAGMENT_SHADER, frag),
    ]);
};

;// CONCATENATED MODULE: ./src/index.ts



const main = () => {
    // Get a WebGL 2 context
    const canvas = document.querySelector('#c');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error("Couldn't activate webgl2 context");
    }
    // Lint the two shaders into a program
    const program = createProgramFromSources(gl, [
        helloworld,
        shaders_helloworld,
    ]);
    // Look up where the vertex data needs to go
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    // look up uniform locations
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // three 2d points
    const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Create a vertex array object
    const vao = gl.createVertexArray();
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);
    // turn it on
    gl.enableVertexAttribArray(positionAttributeLocation);
    // tell the attribute how to get data out of positionBuffer
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // resize canvas
    const resizer = observeAndResizeCanvas(gl.canvas, [300, 150]);
    const drawScene = () => {
        resizer.resizeCanvasToDisplaySize();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Pass in the canvas resolution so we can convert from pizels to clip space in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);
        // draw
        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = 6;
        gl.drawArrays(primitiveType, offset, count);
        requestAnimationFrame(drawScene);
    };
    requestAnimationFrame(drawScene);
};
main();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map