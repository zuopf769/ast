const TypeAnnotationMap = {
  TSNumberKeyword: 'NumericLiteral'
}
const eslintPlugin = () => {
  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      VariableDeclarator(path, state) {
        const errors = state.file.get('errors')
        const { node } = path
        const idType = TypeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type]
        const initType = node.init.type
        console.log(idType, initType)
        if (idType !== initType) {
          errors.push(path.get('init').buildCodeFrameError(`无法把${initType}类型赋值给${idType}类型`, Error))
        }
      }
    },
    post(file) {
      console.log(...file.get('errors'))
    }
  }
}
module.exports = eslintPlugin
