const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')

const sourceCode = `
    function scopeOnce() {
        var ref = "This is a binding";
    
        ref; // This is a reference to a binding
    
        function scopeTwo() {
            var a = 1;
            var b = 2;
            ref; // This is a reference to a binding from a lower scope
        }
    }
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
})

let visitor = {
  FunctionDeclaration(path, state) {
    console.log(path.node.type)
    let scope = path.scope
    console.log(scope.bindings)
  }
}

// 点进去parse方法，可以查看各种数据类型
traverse(ast, visitor)

const { code, map } = generate(ast)
// console.log(code);
