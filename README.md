## 1.抽象语法树(Abstract Syntax Tree)

+ 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示
+ 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

## 2.抽象语法树用途

+ 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
+ 优化变更代码，改变代码结构使达到想要的结构

## 3.抽象语法树定义

+ 这些工具的原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/08/18-48-21-bf5fa63a465ba80cd6d3827e901c5629-20230308184821-ae6bd5.png)

## 4. JavaScript Parser

JavaScript Parser是把JavaScript源码转化为抽象语法树的解析器

### 4.1 常用的 JavaScript Parser
+ SpiderMonkey
    - estree
        - esprima
        - acorn
            - babel parser

### 4.2 AST节点 

+ [estree](https://github.com/estree/estree)
+ [Parser API](https://web.archive.org/web/20210314002546/https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)
+ [spec.md](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
+ [astexplorer](https://astexplorer.net/)
+ AST节点
    - File 文件
    - Program 程序
    - Literal 字面量 NumericLiteral StringLiteral BooleanLiteral
    - Identifier 标识符
    - Statement 语句
    - Declaration 声明语句
    - Expression 表达式
    - Class 类

### 4.3 AST遍历

+ [astexplorer](https://astexplorer.net/)
+ AST是深度优先遍历

> src/01.js

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

+ Babel 能够转译 ECMAScript 2015+ 的代码，使它在旧的浏览器或者环境中也能够运行
+ 工作过程分为三个部分
    - Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree](https://github.com/estree/estree)节点
    - Transform(转换) 对抽象语法树进行转换
    - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/08/19-28-11-e2aeea4c05515c05fc81b3e18f9d18dd-20230308192810-e00fb9.png)

### 5.1 babel 插件

+ [@babel/parser](https://github.com/babel/babel/tree/master/packages/babel-parser) 可以把源码转换成AST
+ [@babel/traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
+ [@babel/generate](https://github.com/babel/babel/tree/master/packages/babel-generator) 可以把AST生成源码，同时生成sourcemap
+ [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
+ [@babel/template](https://github.com/babel/babel/tree/master/packages/babel-template)可以简化AST的创建逻辑
+ [@babel/code-frame](https://www.npmjs.com/package/@babel/code-frame)可以打印代码位置
+ [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
+ [babylon](https://www.npmjs.com/package/babylon) Babel 的解析器，以前叫babel parser,是基于acorn扩展而来，扩展了很多语法,可以支持es2020、jsx、typescript等语法
+ [babel-types-api](https://babeljs.io/docs/babel-types.html)
+ [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
+ [babeljs.io](https://babeljs.io/repl) babel 可视化编译器
+ [babel-types](https://babeljs.io/docs/babel-types)
+ [类型别名](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2489-L2535)
+ [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types)

