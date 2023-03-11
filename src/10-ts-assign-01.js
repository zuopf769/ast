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
      AssignmentExpression(path, state) {
        const errors = state.file.get('errors')
        const variable = path.scope.getBinding(path.get('left'))
        const variableAnnotation = variable.path.get('id').getTypeAnnotation()
        const variableType = transformType(variableAnnotation.type)
        const valueType = transformType(path.get('right').getTypeAnnotation().type)
        if (variableType !== valueType) {
          Error.stackTraceLimit = 0
          errors.push(path.get('init').buildCodeFrameError(`无法把${valueType}赋值给${variableType}`, Error))
        }
      }
    },
    post(file) {
      console.log(...file.get('errors'))
    }
  }
}

let sourceCode = `
  var age:number;
  age = "12";
`

const result = babel.transform(sourceCode, {
  parserOpts: { plugins: ['typescript'] },
  plugins: [tscCheckPlugin()]
})
console.log(result.code)
