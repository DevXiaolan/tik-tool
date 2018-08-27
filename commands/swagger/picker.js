const fs = require('fs')
const esprima = require('esprima')
const codegen = require('escodegen')
const path = require('path')

class Picker {
  constructor(filepath) {
    this.tag = path.basename(filepath)
    this.filepath = filepath
    this.def = {}
    this.ast = esprima.parseScript(fs.readFileSync(filepath).toString(), {
      attachComment: true,
      tolerant: true
    }).body
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
                desc: expression.leadingComments ? expression.leadingComments[0].value : '未写注释',
                params: _handler
              }
            }
          } else if (expression.declarations[0].init.type === 'Literal') {
            //变量的字面量声明
            this.def[expression.declarations[0].id.name] = expression.declarations[0].init.value
          } else if (expression.declarations[0].init.type === 'ObjectExpression') {

            let _id = expression.declarations[0].id.name
            this.def[_id] = this.def[_id] || {}
            expression.declarations[0].init.properties.forEach(p => {
              this.def[_id][p.key.name] = p.value.value
            })
          } else if (expression.declarations[0].init.type === 'ArrayExpression') {
            let _id = expression.declarations[0].id.name
            this.def[_id] = this.def[_id] || []
            expression.declarations[0].init.elements.forEach(p => {
              this.def[_id].push(p.value)
            })
          } else if (expression.declarations[0].init.type === 'CallExpression' && expression.declarations[0].init.callee.name === 'require') {

            //require语句
            const _path = path.resolve(`${path.dirname(this.filepath)}/${expression.declarations[0].init.arguments[0].value}`)

            if (fs.existsSync(`${_path}.js`)) {
              let _v = require(_path)
              if (expression.declarations[0].id.type === 'ObjectPattern') {
                expression.declarations[0].id.properties.forEach(p => {
                  this.def[p.key.name] = _v[p.key.name]
                })
              } else {
                this.def[expression.declarations[0].id.name] = _v
              }
            }
          } else {
            //console.log(JSON.stringify(expression.declarations, null, 2))
          }
        }
      }
    }
  }

  defParams(line, _handler) {
    let result = null
    if (line.type === 'VariableDeclaration') {
      const init = line.declarations[0].init
      if (init === null) {
        return result
      }
      if (init && init.type === 'CallExpression' && init.callee.type === 'MemberExpression') {
        //找到符合参数校验语法的一行代码

        const code = codegen.generate(init.callee.object)

        if (!code.includes('ctx.')) {
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
                  headers: 'header',
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
              let matched = pieces[i].replace('isIn(', '').replace(')', '').replace(/\'/g, '"')

              try {
                result.choices = JSON.parse(matched)
              } catch (e) {
                result.choices = []

                !((l) => {
                  const _ast = esprima.parseScript(l)
                  if (_ast.body[0].expression.arguments[0].type === 'Identifier') {
                    result.choices = this.def[_ast.body[0].expression.arguments[0].name]
                    return
                  }
                  const elements = _ast.body[0].expression.arguments[0].elements
                  elements.forEach(el => {

                    if (el.type === 'Literal') {
                      result.choices.push(el.value)
                    } else if (el.type === 'Identifier') {
                      result.choices.push(this.def[el.name] || 'UNKNOWN')
                    } else if (el.type === 'MemberExpression') {
                      let v = 'UNKNOWN'
                      let [obj, prop] = [el.object.name, el.property.value]
                      v = this.def[obj] ? (this.def[obj][prop] || v) : v
                      result.choices.push(v)
                    } else {
                      console.log(el)
                      process.exit()
                    }
                  })

                })(pieces[i])

              }
            } else if (pieces[i].startsWith('gt(') || pieces[i].startsWith('gte(')) {
              let min = pieces[i].match(/gt[e]?\((.*?)\)/)
              result.min = +min[1]
            } else if (pieces[i].startsWith('lt(') || pieces[i].startsWith('lte(')) {
              let max = pieces[i].match(/lt[e]?\((.*?)\)/)
              result.max = +max[1]
            } else if (pieces[i].startsWith('defaultTo(')) {
              const df = pieces[i].match(/defaultTo\((.*?)\)/)
              result.default = df ? df[1] : ''
            }
          }
        }
      } else {

        const code = codegen.generate(init)
        if (code === 'ctx.headers' && line.declarations[0].id.type === 'ObjectPattern') {
          if (line.declarations[0].id.properties.length) {
            line.declarations[0].id.properties.forEach(p => {
              result = {}
              result.desc = line.leadingComments && line.leadingComments[0] && line.leadingComments[0].value
              result.position = 'headers'
              result.name = p.value.name
            })
          }
        } else if (code.includes('ctx.headers')) {
          let matched = code.match(/ctx\.headers\.(\w+)/)
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