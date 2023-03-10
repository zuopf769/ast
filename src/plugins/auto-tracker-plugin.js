// 模块导入快捷帮助方法
const importModule = require('@babel/helper-module-imports')
const template = require('@babel/template')
const types = require('@babel/types')

/**
 * 实现此插件需要二步
 * 1.判断是否源代码里已经引入了logger模块，如果引入了直接用，如果没有引入要手工引入
 * 2.找到代码中所有的函数，向里面插件调用logger方法
 */
const autoLoggerPlugin = options => {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          let loggerId
          path.traverse({
            ImportDeclaration(path) {
              // path.get(key) 获取某个属性的 path
              // path.set(key, node) 设置某个属性
              const libName = path.get('source').node.value
              if (libName === options.name) {
                // path直接表达式
                const specifierPath = path.get('specifiers.0')
                // ImportDefault 默认导入
                // import logger from 'logger'
                // Import 普通导入
                // import { logger } from 'logger';
                // ImportNamespace 命名空间导入
                // import * as logger from 'logger';
                if (
                  specifierPath.isImportDefaultSpecifier() ||
                  specifierPath.isImportSpecifier() ||
                  specifierPath.isImportNamespaceSpecifier()
                ) {
                  // import { logger1 as logger1 } from 'logger';
                  // local才是我们使用的， import
                  loggerId = specifierPath.local.name
                }
                // 找到想找的package import就退出，没必要继续遍历
                path.stop()
              }
            }
          })
          //如果loggerId在遍历完了以后还是undefined，需要手工创建import语句
          if (!loggerId) {
            //  import xx from 'logger'
            //  https://babeljs.io/docs/babel-helper-module-imports
            loggerId = importModule.addDefault(path, options.name, {
              // 明确指定_hintedName
              // import { named as _hintedName } from "source"
              // if the hintedName isn't set, the function will gennerate a uuid as hintedName itself such as '_named'
              // import { named as _named } from "source"
              nameHint: path.scope.generateUid(options.name)
            })
          }
          // https://babeljs.io/docs/babel-template
          // LOGGER为placeholders占位符，会被传入的数据替换掉
          // ejs 模板引擎 返回的是一个语法树的节点
          // 生成一个方法调用节点：logger()
          // state.loggerNode = types.expressionStatement(types.callExpression(types.identifier(loggerId), []));
          // state.loggerNode = template.statement(`${loggerId}();`)();
          state.loggerNode = template.statement(`LOGGER();`)({
            LOGGER: loggerId
          })
        }
      },
      'FunctionExpression|FunctionDeclaration|ArrowFunctionExpression|ClassMethod'(path, state) {
        const { node, parent } = path
        // 函数声明node?.id?.name
        // 函数表达式parent?.id?.name
        // 类函数node?.key?.name
        if (
          (node?.id?.name || parent?.id?.name || node?.key?.name) &&
          options.whiteLists.includes(node?.id?.name || parent?.id?.name || node?.key?.name)
        ) {
          // 如果它的body已经是一个语句块了，直接在块的开始添加方法调用即可
          if (types.isBlockStatement(node.body)) {
            node.body.body.unshift(state.loggerNode)
          } else {
            // const newNode = types.blockStatement([state.loggerNode, types.expressionStatement(node.body)])
            const newNode = types.blockStatement([state.loggerNode, ...node.body])
            path.get('body').replaceWith(newNode)
          }
        }
      }
    }
  }
}
module.exports = autoLoggerPlugin
