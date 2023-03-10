## 1.抽象语法树(Abstract Syntax Tree)

- 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示
- 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

## 2.抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
- 优化变更代码，改变代码结构使达到想要的结构

## 3.抽象语法树定义

- 这些工具的原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/08/18-48-21-bf5fa63a465ba80cd6d3827e901c5629-20230308184821-ae6bd5.png)

## 4. JavaScript Parser

JavaScript Parser 是把 JavaScript 源码转化为抽象语法树的解析器

### 4.1 常用的 JavaScript Parser

- SpiderMonkey
  - estree
    - esprima
    - acorn
      - babel parser

### 4.2 AST 节点

- [estree](https://github.com/estree/estree)
- [Parser API](https://web.archive.org/web/20210314002546/https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)
- [spec.md](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
- [astexplorer](https://astexplorer.net/)
- AST 节点
  - File 文件
  - Program 程序
  - Literal 字面量 NumericLiteral StringLiteral BooleanLiteral
  - Identifier 标识符
  - Statement 语句
  - Declaration 声明语句
  - Expression 表达式
  - Class 类

### 4.3 AST 遍历

- [astexplorer](https://astexplorer.net/)
- AST 是深度优先遍历

> src/01-esprima.js

```
Program进入
  FunctionDeclaration进入
    Identifier进入
    Identifier离开
    BlockStatement进入
    BlockStatement离开
  FunctionDeclaration离开
Program离开
```

## 5.babel

- Babel 能够转译 ECMAScript 2015+ 的代码，使它在旧的浏览器或者环境中也能够运行
- 工作过程分为三个部分
  - Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree](https://github.com/estree/estree)节点
  - Transform(转换) 对抽象语法树进行转换
  - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/08/19-28-11-e2aeea4c05515c05fc81b3e18f9d18dd-20230308192810-e00fb9.png)

### 5.1 babel 插件

- [@babel/parser](https://github.com/babel/babel/tree/master/packages/babel-parser) 可以把源码转换成 AST
- [@babel/traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- [@babel/generate](https://github.com/babel/babel/tree/master/packages/babel-generator) 可以把 AST 生成源码，同时生成 sourcemap
- [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
- [@babel/template](https://github.com/babel/babel/tree/master/packages/babel-template)可以简化 AST 的创建逻辑
- [@babel/code-frame](https://www.npmjs.com/package/@babel/code-frame)可以打印代码位置
- [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
- [babylon](https://www.npmjs.com/package/babylon) Babel 的解析器，以前叫 babel parser,是基于 acorn 扩展而来，扩展了很多语法,可以支持 es2020、jsx、typescript 等语法
- [babel-types-api](https://babeljs.io/docs/babel-types.html)
- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babeljs.io](https://babeljs.io/repl) babel 可视化编译器
- [babel-types](https://babeljs.io/docs/babel-types)
- [类型别名](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2489-L2535)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types)

### 5.2 Visitor

- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- Visitor 的对象定义了用于 AST 中获取具体节点的方法
- Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法

#### 5.2.1 path

- [path](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/index.ts)
- node 当前 AST 节点
- parent 父 AST 节点
- parentPath 父 AST 节点的路径
- scope 作用域
- get(key) 获取某个属性的 path
- set(key, node) 设置某个属性
- [is 类型(opts)](https://github1s.com/babel/babel/blob/main/packages/babel-traverse/src/path/generated/validators.d.ts) 判断当前节点是否是某个类型
- find(callback) 从当前节点一直向上找到根节点(包括自己)
- findParent(callback)从当前节点一直向上找到根节点(不包括自己)
- insertBefore(nodes) 在之前插入节点
- insertAfter(nodes) 在之后插入节点
- replaceWith(replacement) 用某个节点替换当前节点
- replaceWithMultiple(nodes) 用多个节点替换当前节点
- replaceWithSourceString(replacement) 把源代码转成 AST 节点再替换当前节点
- remove() 删除当前节点
- traverse(visitor, state) 遍历当前节点的子节点,第 1 个参数是节点，第 2 个参数是用来传递数据的状态
- skip() 跳过当前节点子节点的遍历
- stop() 结束所有的遍历

#### 5.2.2 scope

- [scope](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts)
- scope.bindings 当前作用域内声明所有变量
- scope.path 生成作用域的节点对应的路径
- scope.references 所有的变量引用的路径
- getAllBindings() 获取从当前作用域一直到根作用域的集合
- getBinding(name) 从当前作用域到根使用域查找变量
- getOwnBinding(name) 在当前作用域查找变量
- parentHasBinding(name, noGlobals) 从当前父作用域到根使用域查找变量
- removeBinding(name) 删除变量
- hasBinding(name, noGlobals) 判断是否包含变量
- moveBindingTo(name, scope) 把当前作用域的变量移动到其它作用域中
- generateUid(name) 生成作用域中的唯一变量名,如果变量名被占用就在前面加下划线

### 5.3 转换箭头函数

- [astexplorer](https://astexplorer.net/)
- [babel-plugin-transform-es2015-arrow-functions](https://www.npmjs.com/package/babel-plugin-transform-es2015-arrow-functions)
- [babeljs.io](https://babeljs.io/repl) babel 可视化编译器
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
- [babel-types-api](https://babeljs.io/docs/babel-types.html)

> 开启两个 astexplorer，一个是转换前的，一个是转换后的，肉眼对比两个 node 的差异，从而增删改

转换前

```JavaScript
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
```

转换后

```JavaScript
var _this = this;
const sum = function (a, b) {
  console.log(_this);
  const minus = function (c, d) {
    console.log(_this);
    return c - d;
  };
  const multi = function (e, f) {
    console.log(_this);
    return e * f;
  };
};
```

> src/02-arrow-0x.js

### 5.4 把类编译为 Function

- [@babel/plugin-transform-classes](https://www.npmjs.com/package/@babel/plugin-transform-classes)

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/10/10-44-23-d699e03cba09d9dc46fd15646d86ef6c-20230310104422-f519fe.png)

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/10/10-47-23-601dd8e9ddaa3190281ef2e7419e91b3-20230310104722-4e9688.png)

> src/03-classes-01.js

## 5.6 实现日志插件

给 console[log|info|error|warn|debugg]方法添加参数：文件 行号:列号

```JavaScript
{
    loc: {
        start: { line: 1, column: 1 }
    }
}
```

> src/04-logger-01.js

## 5.7 自动日志插件

- [babel-helper-plugin-utils](https://babeljs.io/docs/babel-helper-plugin-utils)
- [babel-types](https://babeljs.io/docs/babel-types.html#api) 用来生成节点和判断节点类型
- [babel-helper-module-imports](https://babeljs.io/docs/babel-helper-module-imports) 帮助插入模块
- [@babel/template](https://babeljs.io/docs/babel-template) 根据字符串模板生成 AST 节点
- state 用于在遍历过程中在 AST 节点之间传递数据的方式
