const { transformSync } = require('@babel/core')
const babelImportPlugin = require('./plugins/babel-plugin-import2')

const sourceCode = `
import { flatten, concat } from 'lodash'
console.log(flatten([1, [2, 3]]))
console.log(concat(['1', '2', '3']))
`
const { code } = transformSync(sourceCode, {
  plugins: [babelImportPlugin({ libraryName: 'lodash', libraryDirectory: '' })]
})
console.log(code)
