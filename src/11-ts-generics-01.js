const babel = require('@babel/core')
function transformType(type) {
  switch (type) {
    case 'TSNumberKeyword':
    case 'NumberTypeAnnotation':
      return 'number'
    case 'TSStringKeyword':
    case 'StringTypeAnnotation':
      return 'string'
  }
}
const tscCheckPlugin = () => {
  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        const trueTypes = path.node.typeParameters.params.map(param => transformType(param.type))
        const argumentsTypes = path.get('arguments').map(arg => transformType(arg.getTypeAnnotation().type))
        const calleePath = path.scope.getBinding(path.get('callee').node.name).path
        const genericMap = new Map()
        calleePath.node.typeParameters.params.map((item, index) => {
          genericMap[item.name] = trueTypes[index]
        })
        const paramsTypes = calleePath.get('params').map(arg => {
          const typeAnnotation = arg.getTypeAnnotation()
          if (typeAnnotation.type === 'TSTypeReference') {
            return genericMap[typeAnnotation.typeName.name]
          } else {
            return transformType(type)
          }
        })
        Error.stackTraceLimit = 0
        paramsTypes.forEach((type, index) => {
          console.log(type, argumentsTypes[index])
          if (type !== argumentsTypes[index]) {
            errors.push(
              path
                .get(`arguments.${index}`)
                .buildCodeFrameError(`实参${argumentsTypes[index]}不能匹配形参${type}`, Error)
            )
          }
        })
      }
    },
    post(file) {
      console.log(...file.get('errors'))
    }
  }
}

// 泛型
let sourceCode = `
  function join<T>(a:T,b:T):string{
      return a+b;
  }
  join<number>(1,'2');
`

const result = babel.transform(sourceCode, {
  parserOpts: { plugins: ['typescript'] },
  plugins: [tscCheckPlugin()]
})
console.log(result.code)
