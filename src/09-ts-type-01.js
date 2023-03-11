const { transformSync } = require('@babel/core')
const tscCheckPlugin = require('./plugins/tsc-check-plugin')

const sourceCode = `
var age:number="12";
`

const { code } = transformSync(sourceCode, {
  parserOpts: { plugins: ['typescript'] },
  plugins: [tscCheckPlugin()]
})

console.log(code)
