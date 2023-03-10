const { transformSync } = require('@babel/core')
const uglifyPlugin = require('./plugins/uglify-plugin')
const sourceCode = `
function getAge(){
  var ageaaaaaaaaaaa = 12;
  console.log(ageaaaaaaaaaaa);
  var namebbbbbbbbbbbbbbbbbbbb = '';
  console.log(namebbbbbbbbbbbbbbbbbbbb);
}
`
const { code } = transformSync(sourceCode, {
  plugins: [uglifyPlugin()]
})
console.log(code)
