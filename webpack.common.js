const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: {
    fundamentals: './src/fundamentals.ts',
    '2d-translation': './src/2d-translation.ts',
    '3d-ortho': './src/3d-ortho.ts',
    '3d-perspective': './src/3d-perspective.ts',
    '3d-camera': './src/3d-camera.ts',
    '3d-shading': './src/3d-shading.ts',
    '3d-spotlight': './src/3d-spotlight.ts',
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
