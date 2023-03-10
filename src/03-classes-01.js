// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法树的节点
let t = require('@babel/types')
// 用来验证@babel/plugin-transform-classes的输出结果
// let transformClassesPlugin = require('@babel/plugin-transform-classes')

let transformClassesPlugin = {
  visitor: {
    //如果是类，那么就会进来此函数，参数是箭头函数的节点路径对象
    ClassDeclaration(path) {
      let { node } = path
      let id = node.id // 可以复用的：Identifier name:Person
      let methods = node.body.body //Array<MethodDefinition>
      let nodes = []
      methods.forEach(method => {
        let { params, body, generator, async } = method
        if (method.kind === 'constructor') {
          let constructorMethod = t.functionDeclaration(id, params, body, generator, async)
          nodes.push(constructorMethod)
        } else {
          let memberExpression = t.memberExpression(t.memberExpression(id, t.identifier('prototype')), method.key)
          let functionExpression = t.functionExpression(null, params, body, generator, async)
          let assignmentExpression = t.assignmentExpression('=', memberExpression, functionExpression)
          let expressionStatement = t.expressionStatement(assignmentExpression)
          nodes.push(expressionStatement)
        }
      })
      if (nodes.length === 1) {
        //单节点用replaceWith
        //path代表路径，用nodes[0]这个新节点替换旧path上现有老节点node ClassDeclaration
        path.replaceWith(nodes[0])
      } else {
        //多节点用replaceWithMultiple
        path.replaceWithMultiple(nodes)
      }
    }
  }
}

let sourceCode = `
  class Person {
    constructor(name) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
    sayName(){
      console.log(this.name);
    }
  }
`

let targetSource = core.transform(sourceCode, {
  plugins: [transformClassesPlugin]
})

console.log(targetSource.code)
