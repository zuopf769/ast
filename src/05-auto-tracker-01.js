const core = require('@babel/core')
const types = require('@babel/types')
const pathLib = require('path')
const autoTrackerPlugin = require('./plugins/auto-tracker-plugin')
//函数声明 函数表达式 箭头函数 类里的函数
const sourceCode = `
import xxx1 from 'logger1';
import xxx2 from 'logger2';
import xxx3 from 'logger3';
function sum(a,b){
  return a+b;
}
function sum1(a,b){
  return a+b;
}
const multiply = function(a,b){
  return a*b;
}
const minus = (a,b)=>a-b;

class Calculator{
  divide(a,b){
    console.log('divide');
    return a/b;
  }
}
`
const result = core.transform(sourceCode, {
  plugins: [
    autoTrackerPlugin({
      name: 'logger',
      whiteLists: ['sum', 'multiply', 'divide'],
      blackLists: ['black']
    })
  ]
  //logger模块作用可以做埋点监控，可以向服务器发送数据
})
console.log(result.code)
