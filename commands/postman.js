const fs = require('fs');
const request = require('request-promise');
const urlParse = require('url').parse;

module.exports = (argv) => {
  const appId = argv._[1];
  const projectRoot = process.cwd();
  let swagger = {};

  if (appId) {
    // how
    request.get(`http://47.110.247.228:${appId}/v1.0.0/swagger`)
      .then(v => {
        swagger = JSON.parse(v)
        const pm = {
          info: {
            _postman_id: '',
            name: swagger.info.name,
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
          },
          item: []
        };
        for (const item of Object.keys(swagger.paths)) {
          const path = `${swagger.basePath}${item}`;
          const request = Object.keys(swagger.paths[item]).map(method => {
            const info = swagger.paths[item][method];
            const [header, body, query] = [[], {
              mode: 'urlencoded',
              urlencoded: []
            }, []];
            if (['post', 'put'].includes(method)) {
              header.push({
                key: 'Content-Type',
                value: 'application/x-www-form-urlencoded'
              });
            }
            info.parameters.forEach(param => {
              switch (param.in) {
                case 'headers':
                  header.push({
                    key: param.name,
                    value: ''
                  });
                  break;
                case 'body':
                  body.urlencoded.push({
                    key: param.name,
                    value: '',
                    type: 'text'
                  });
                  break;
                case 'query':
                  query.push({
                    key: param.name,
                    value: ''
                  });
                  break;
                default:
                  break;
              }
            });
            const rawUrl = `${swagger.schemes[0]}://${swagger.host}${path}`;
            const urlInfo = urlParse(rawUrl);
            return {
              method: method.toUpperCase(),
              description: info.description,
              header,
              body,
              query,
              url: {
                raw: rawUrl,
                protocol: swagger.schemes[0],
                port: urlInfo.port,
                host: urlInfo.hostname.split('.'),
                path: urlInfo.pathname.split('/').slice(1)
              }
            };
          });
          request.forEach(res => {
            pm.item.push({
              name: path,
              request: res,
              response: []
            });
          });
        }

        const spaceLength = 2;
        fs.writeFileSync(`${process.cwd()}/postman.json`, JSON.stringify(pm, null, spaceLength));
        console.log(`File generated: ${`${process.cwd()}/postman.json`.green}`);
        
        process.exit();
      })
      .catch(e => {
        console.log('不管了');
        process.exit();
      })
  } else {
    try {
      swagger = require(`${projectRoot}/swagger.json`);
      const pm = {
        info: {
          _postman_id: '',
          name: swagger.info.name,
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: []
      };
      for (const item of Object.keys(swagger.paths)) {
        const path = `${swagger.basePath}${item}`;
        const request = Object.keys(swagger.paths[item]).map(method => {
          const info = swagger.paths[item][method];
          const [header, body, query] = [[], {
            mode: 'urlencoded',
            urlencoded: []
          }, []];
          if (['post', 'put'].includes(method)) {
            header.push({
              key: 'Content-Type',
              value: 'application/x-www-form-urlencoded'
            });
          }
          info.parameters.forEach(param => {
            switch (param.in) {
              case 'headers':
                header.push({
                  key: param.name,
                  value: ''
                });
                break;
              case 'body':
                body.urlencoded.push({
                  key: param.name,
                  value: '',
                  type: 'text'
                });
                break;
              case 'query':
                query.push({
                  key: param.name,
                  value: ''
                });
                break;
              default:
                break;
            }
          });
          const rawUrl = `${swagger.schemes[0]}://${swagger.host}${path}`;
          const urlInfo = urlParse(rawUrl);
          return {
            method: method.toUpperCase(),
            description: info.description,
            header,
            body,
            query,
            url: {
              raw: rawUrl,
              protocol: swagger.schemes[0],
              port: urlInfo.port,
              host: urlInfo.hostname.split('.'),
              path: urlInfo.pathname.split('/').slice(1)
            }
          };
        });
        request.forEach(res => {
          pm.item.push({
            name: path,
            request: res,
            response: []
          });
        });
      }

      const spaceLength = 2;
      fs.writeFileSync(`${process.cwd()}/postman.json`, JSON.stringify(pm, null, spaceLength));
      console.log(`File generated: ${`${process.cwd()}/postman.json`.green}`);
      process.exit();
    } catch (_) {
      console.log('swagger.json NOT FOUND, run tik swagger first !'.yellow);
      process.exit();
    }
  }
};