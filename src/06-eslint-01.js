const core = require('@babel/core')
const types = require('@babel/types')
const path = require('path')
const eslintPlugin = require('./plugins/eslint-plugin')
const sourceCode = `
var a = 1;
console.log(a);
var b = 2;
`
const { code } = core.transformSync(sourceCode, {
  plugins: [eslintPlugin({ fix: true })]
})
console.log(code)
