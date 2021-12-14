const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: {
    '3d-perspective': './src/3d-perspective.ts',
    '3d-camera': './src/3d-camera.ts',
    '3d-shading': './src/3d-shading.ts',
    '3d-spotlight': './src/3d-spotlight.ts',
    'draw-multiple': './src/draw-multiple.ts',
    'scene-graph': './src/scene-graph.ts',
    'twgl-test': './src/twgl-test.ts',
    'obj-loading': './src/obj-loading.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(frag|vert)$/,
        type: 'asset/source'
      },
      {
        test: /\.(obj|mtl)$/,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['ts'],
    }),
  ],
}
