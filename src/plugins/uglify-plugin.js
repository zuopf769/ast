const uglifyPlugin = () => {
  return {
    visitor: {
      // 类型别名
      // https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2225-L2244
      Scopable(path) {
        // 当前作用域的所有变量
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          // 在当前的作用域中生成一个不重复的变量名
          // 默认以_temp作为前缀
          const newName = path.scope.generateUid()
          // const newName = path.scope.generateUid('t')
          // age => t1 name => t2
          // 重命名
          // https://github1s.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts#L622
          binding.path.scope.rename(key, newName)
        })
      }
    }
  }
}
module.exports = uglifyPlugin
