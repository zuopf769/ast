const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/08-webpack-babel-01.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                // 编译顺序为首先plugins从左往右,然后presets从右往左
                path.resolve(__dirname, 'src/plugins/babel-plugin-import.js'),
                {
                  libraryName: 'lodash',
                  libraryDirectory: ''
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
