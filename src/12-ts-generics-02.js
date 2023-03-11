const babel = require('@babel/core')
function transformType(type) {
  switch (type) {
    case 'TSNumberKeyword':
    case 'NumberTypeAnnotation':
      return 'number'
    case 'TSStringKeyword':
    case 'StringTypeAnnotation':
      return 'string'
    case 'TSLiteralType':
      return 'liternal'
    default:
      return type
  }
}
const tscCheckPlugin = () => {
  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      TSTypeAliasDeclaration(path) {
        const typeName = path.node.id.name
        const typeInfo = {
          typeParams: path.node.typeParameters.params.map(item => item.name), //['K']
          typeAnnotation: path.getTypeAnnotation() //{checkType,extendsType,trueType,falseType}
        }
        path.scope.setData(typeName, typeInfo)
      },
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        const trueTypes = path.node.typeParameters.params.map(param => {
          //TSTypeReference   typeName=Infer  typeParameters=[]
          if (param.type === 'TSTypeReference') {
            const name = param.typeName.name //Infer
            const { typeParams, typeAnnotation } = path.scope.getData(name) //typeParams=['K']
            const trueTypeParams = typeParams.reduce((memo, name, index) => {
              memo[name] = param.typeParameters.params[index].type //TSLiteralType
              return memo
            }, {}) //trueTypeParams={K:'TSLiteralType'}
            const { checkType, extendsType, trueType, falseType } = typeAnnotation
            let check = checkType.type
            if (check === 'TSTypeReference') {
              check = trueTypeParams[checkType.typeName.name]
            }
            if (transformType(check) === transformType(extendsType.type)) {
              return transformType(trueType.type)
            } else {
              return transformType(falseType.type)
            }
          } else {
            return transformType(param.type)
          }
        })
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

let sourceCode = `
    type Infer<K> = K extends 'number' ? number : string;
    function sum<T>(a: T, b: T) {

    }
    sum<Infer<'number'>>(1, 2);
`

const result = babel.transform(sourceCode, {
  parserOpts: { plugins: ['typescript'] },
  plugins: [tscCheckPlugin()]
})
console.log(result.code)
