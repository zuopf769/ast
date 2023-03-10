// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法树的节点
let t = require('@babel/types')
// 由于和节点的path重名
const pathLib = require('path')

//state代表状态，用在在插件处理的过程传递一些值或者变量
let LoggerPlugin = {
  visitor: {
    CallExpression(path, state) {
      let { node } = path
      // path也有判断节点类型的api，但是只能判断当前节点的类型
      // https://github1s.com/babel/babel/blob/main/packages/babel-traverse/src/path/generated/validators.d.ts
      if (t.isMemberExpression(node.callee)) {
        if (node.callee.object.name === 'console') {
          if (['log', 'info', 'warn', 'error', 'debug'].includes(node.callee.property.name)) {
            const { line, column } = node.loc.start
            // filename需要transform传了才会有值
            // cwd肯定有值
            const { filename, cwd } = state.file.opts
            const relativeFileName = pathLib.relative(__dirname, filename).replace(/\\/g, '/')
            node.arguments.unshift(t.stringLiteral(`${relativeFileName} ${line}:${column}`))
          }
        }
      }
    }
  }
}

let sourceCode = `
  console.log('log');
  function main() {
    console.info('info');

    function sum(a, b) {
      console.log('sum ', a, b);

      function error() {
        console.error('error');
      }
    }
  }
`

let targetSource = core.transform(sourceCode, {
  plugins: [LoggerPlugin],
  filename: '04-looger-01.js'
})

console.log(targetSource.code)
