// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法树的节点
let types = require('@babel/types')
// 用来验证babel-plugin-transform-es2015-arrow-functions的输出结果
// let arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions')
let arrowFunctionPlugin = {
  visitor: {
    // 如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path
      // 直接修改node的type类型
      node.type = 'FunctionExpression'
    }
  }
}

let sourceCode = `
    const sum = (a, b) => {
        return a + b;
    }
`

let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin]
})

console.log(targetSource.code)
