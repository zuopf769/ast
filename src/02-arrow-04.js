// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法树的节点
let t = require('@babel/types')
// 用来验证babel-plugin-transform-es2015-arrow-functions的输出结果
// let arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions')

let arrowFunctionPlugin = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path
      hoistFunctionEnvironment(path)
      node.type = 'FunctionExpression'
      let body = node.body
      //如果函数体不是语句块
      if (!t.isBlockStatement(body)) {
        // blockStatement的参数是数组
        node.body = t.blockStatement([t.returnStatement(body)], [])
      }
    }
  }
}

/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} path
 */
function hoistFunctionEnvironment(path) {
  //1.确定我要用哪里的this 向上找不是箭头函数的函数或者根节点
  // 当前路径向上查找，找到第一个不是箭头函数的node，没找到就到Program节点
  const thisEnv = path.findParent(parent => {
    return (parent.isFunction() && !parent.isArrowFunctionExpression()) || parent.isProgram()
  })

  // bindings UIDs
  var thisName = '_this'
  let thisPaths = getThisPaths(path)
  // 存在this变量
  if (thisPaths.length > 0) {
    if (!thisEnv.scope.hasBinding(thisName)) {
      // https://github.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts#L1050
      thisEnv.scope.push({
        id: t.identifier(thisName),
        init: t.thisExpression()
      })
    }
  }

  thisPaths.forEach(thisPath => {
    thisPath.replaceWith(t.identifier(thisName))
  })
}

/**
 * 遍历当前path的所有的子path，找出所有的ThisExpression对应的node
 * @param {*} path
 * @returns
 */
function getThisPaths(path) {
  let thisPath = []
  // 遍历当前path的所有的子path
  path.traverse({
    //如果是this表达式，那么就会进来此函数，参数是this表达式节点路径对象
    ThisExpression(path) {
      thisPath.push(path)
    }
  })
  return thisPath
}

let sourceCode = `
  const sum = (a, b) => {
      console.log(this);
      const minus = (c,d)=>{
          console.log(this);
          return c-d;
      }
      const multi = (e,f)=>{
        console.log(this);
        return e*f;
    }
  };
`

let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin]
})

console.log(targetSource.code)
