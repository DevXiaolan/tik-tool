const fs = require('fs')
const esprima = require('esprima')
const codegen = require('escodegen')
const path = require('path')

class Picker {
  constructor(filepath) {
    this.tag = path.basename(filepath)
    this.filepath = filepath
    this.ast = esprima.parseScript(fs.readFileSync(filepath).toString(), { attachComment: true }).body
    this.run()
  }

  run() {
    const ast = this.ast
    this.handlers = {}
    
    for (let k in ast) {
      const expression = ast[k]
      if (expression.type === 'VariableDeclaration') {
        if (expression.declarations[0] && expression.declarations[0].init) {
          if (['ArrowFunctionExpression', 'FunctionExpression'].includes(expression.declarations[0].init.type)) {
            if (expression.declarations[0].init.async && expression.declarations[0].init.params[0] && expression.declarations[0].init.params[0].name === 'ctx') {
              //找到所有定义的 async function
              let _handler = []
              
              const body = expression.declarations[0].init.body.body
              for (let k in body) {
                const f = this.defParams(body[k])
                f && (_handler.push(f))
              }
              this.handlers[expression.declarations[0].id.name] = {
                desc: expression.leadingComments ? expression.leadingComments[0].value: '未写注释',
                params: _handler
              }
            }
          }
        }
      }
    }
  }

  defParams(line, _handler) {
    let result = null
    if (line.type === 'VariableDeclaration') {
      const init = line.declarations[0].init
      
      if (init && init.type === 'CallExpression' && init.callee.type==='MemberExpression') {
        //找到符合参数校验语法的一行代码
        
        const code = codegen.generate(init.callee.object)
        
        if (!code.includes('ctx.')){
          return result
        }
        
        const pieces = code.split('.')
        if (pieces[0] === 'ctx') {
          result = {}
          result.desc = line.leadingComments && line.leadingComments[0] && line.leadingComments[0].value
          for (let i = 1; i < pieces.length; i++) {
            if (pieces[i].startsWith('validate')) {
              const position = pieces[i].match(/validate(.*)\(/)
              if (position) {
                result.position = {
                  headers:'header',
                  query: 'query',
                  body: 'body',
                  param: 'path'
                }[`${position[1]}`.toLowerCase()]
              }
              const name = pieces[i].match(/\(['|"](.*)['|"]/)
              if (name) {
                result.name = `${name[1]}`
              }
            } else if (pieces[i] === 'required()') {
              result.required = true
            } else if (pieces[i].startsWith('to')) {
              result.type = pieces[i].replace('to', '').replace(/\(.*\)/, '').toLowerCase()
            } else if (pieces[i].startsWith('isIn(')) {
              let matched = pieces[i].replace('isIn(','').replace(')','').replace(/\'/g, '"')
              result.choices = JSON.parse(matched)
            } else if (pieces[i].startsWith('gt(') || pieces[i].startsWith('gte(')){
              let min = pieces[i].match(/gt[e]?\((.*?)\)/)
              result.min = +min[1]
            } else if (pieces[i].startsWith('lt(') || pieces[i].startsWith('lte(')){
              let max = pieces[i].match(/lt[e]?\((.*?)\)/)
              result.max = +max[1]
            }
          }
        }
      } else {
        const code = codegen.generate(init)
        if (code.includes('ctx.headers')) {
          const matched = code.match(/ctx\.headers\.(\w+)/)
          if (matched) {
            result = {}
            result.desc = line.leadingComments && line.leadingComments[0] && line.leadingComments[0].value
            result.position = 'headers'
            result.name = matched[1]
          }
        }
      }
    }
    return result
  }
}

module.exports = Picker