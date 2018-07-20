const fs = require('fs')
const esprima = require('esprima')
const path = require('path')
const Err = require('../../utils/error_handler')
const Picker = require('./picker')
const colors = require('colors')

function isRouter(expression) {
  return expression.type === 'ExpressionStatement'
    && expression.expression.type === 'CallExpression'
    && (expression.expression.callee.object.object ? expression.expression.callee.object.object.name === 'router' : expression.expression.callee.object.name === 'router')
}

function isRequirement(expression) {
  return expression.type === 'VariableDeclaration'
    && (expression.declarations[0] && expression.declarations[0].init.callee && expression.declarations[0].init.callee.name === 'require')
    && (expression.declarations[0] && expression.declarations[0].init.arguments && (expression.declarations[0].init.arguments[0].value.startsWith('./middlewares') || expression.declarations[0].init.arguments[0].value.startsWith('./controllers')))
}

function genError(appId) {
  const result = {}
  if(fs.existsSync(`${process.cwd()}/src/error.js`)){
    const e = require(`${process.cwd()}/src/error.js`)
    for(let k in e){
      result[k] = {
        code: (+appId) * 1e6 + e[k].code,
        message: e[k].message
      }
    }
  }
  return result
}

function toSwagger(apis) {
  //console.log(JSON.stringify(apis, null, 2))
  const tikConf = require(`${process.cwd()}/tik.json`)
  const swagger = {
    swagger: '2.0',
    info: {
      ...tikConf,
      title: `${tikConf.group}/${tikConf.name}`,
    },
    host: `172.20.160.7:${tikConf.appId}`,
    basePath: `/v${tikConf.version}`,
    schemes: ['http'],
    paths: {},
    definitions: {},
    errors: genError(tikConf.appId)
  }
  apis.forEach(api => {

    swagger.paths[api.path] = swagger.paths[api.path] || {}
    swagger.paths[api.path][api.method] = swagger.paths[api.path][api.method] || {}
    swagger.paths[api.path][api.method].produces = ['application/json']
    swagger.paths[api.path][api.method].consumes = ['application/json']
    swagger.paths[api.path][api.method].tags = [api.handlers[api.handlers.length - 1].controller]
    swagger.paths[api.path][api.method].description = api.handlers[api.handlers.length - 1].desc
    swagger.paths[api.path][api.method].summary = swagger.paths[api.path][api.method].description
    swagger.paths[api.path][api.method].parameters = []
    swagger.paths[api.path][api.method].operationId = api.handlers[api.handlers.length - 1].func
    swagger.paths[api.path][api.method].responses = {
      '200': {
        example:{
          'application/json':{
            code:0,
            message:'success',
            data:{}
          }
        }
      }
    }
    
    api.handlers.forEach(h => {
      for (let k in h.request) {
        let _tmp = {
          "maximum": h.request[k].max,
          "minimum": h.request[k].min,
          "enum": h.request[k].choices,
          "type": h.request[k].type || '',
          // "format": "uint64",
          // "x-go-name": "Keyword",
          // "x-go-validate": "@uint64[0,10]",
          "name": h.request[k].name,
          "in": h.request[k].position,
          "required": !!h.request[k].required
        }
        swagger.paths[api.path][api.method].parameters.push(_tmp)
      }
    })

  })
  fs.writeFileSync(`${process.cwd()}/swagger.json`, JSON.stringify(swagger, null, 2))
  console.log(`File generated: ${`${process.cwd()}/swagger.json`.green}`)
  process.exit()
}


module.exports = (argv) => {
  const projectRoot = process.cwd()
  if (!fs.existsSync(`${projectRoot}/tik.json`)) {
    console.log('tik.json NOT FOUND !'.yellow)
    process.exit()
  }
  if (!fs.existsSync(`${projectRoot}/src/router.js`)) {
    Err('router not found')
  }
  const router = fs.readFileSync(`${projectRoot}/src/router.js`).toString()
  const ast = esprima.parseScript(router).body
  const controllers = {}
  const apis = []

  for (let k in ast) {
    const expression = ast[k]
    if (isRequirement(expression)) {
      controllers[expression.declarations[0].id.name] = (new Picker(path.resolve(`${projectRoot}/src/${expression.declarations[0].init.arguments[0].value}.js`))).handlers
    }
    if (isRouter(expression)) {
      const args = expression.expression.arguments
      const method = expression.expression.callee.property.name
      const path = args[0].value
      const handlers = []

      for (let i = 1; i < args.length; i++) {
        switch (args[i].type) {
          case 'Identifier':
            handlers.push({
              controller: null,
              func: args[i].name,
              request: controllers[args[i].name][Object.keys(controllers[args[i].name])[0]].params,
              desc: controllers[args[i].name][Object.keys(controllers[args[i].name])[0]].desc
            })
            break
          case 'MemberExpression':
            handlers.push({
              controller: args[i].object.name,
              func: args[i].property.name,
              request: controllers[args[i].object.name][args[i].property.name].params,
              desc: controllers[args[i].object.name][args[i].property.name].desc
            })
            break
        }
      }
      apis.push({
        method,
        path,
        handlers
      })
    }
  }

  toSwagger(apis)
}