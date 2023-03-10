//no-console 禁用 console
const eslintPlugin = ({ fix }) => {
  return {
    // babel插件特有的钩子
    pre(file) {
      // 设置某个变量属性到file容器上底层是map
      file.set('errors', [])
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        const { node } = path
        if (node.callee.object && node.callee.object.name === 'console') {
          // 1. 暂存当前堆栈信息的深度，默认为10
          // const tmp = Error.stackTraceLimit
          // 2. 修改堆栈信息的深度，改成0就不打印堆栈信息
          Error.stackTraceLimit = 5
          //  buildCodeFrameError<TError extends Error>(msg: string, Error?: new (msg: string) => TError): TError;
          errors.push(path.buildCodeFrameError(`代码中不能出现console语句`, Error))
          // 3. 打印完堆栈信息后恢复之前堆栈信息的深度
          // Error.stackTraceLimit = tmp;
          if (fix) {
            // path.parentPath.remove()
            path.remove()
          }
        }
      }
    },
    // babel插件特有的钩子
    post(file) {
      // 从file容器上底层是map取值
      console.log(...file.get('errors'))
    }
  }
}
module.exports = eslintPlugin
