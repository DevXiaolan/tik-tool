### tik 命令行工具 出发点

- 简化重复工作
- 统一开发习惯
- 为后面跟多自动化做支持

### 通过命令行工具初始化项目
	
> tik create xxx

会根据提前准备好的模板创建目录，后续大家可以一起维护这个模板	
### 仪式感的更新版本号

> tik release 

选择更是的尺度是 `patch`,`feature`,`major`

### 生成容器运行管理相关的配置文件

> tik ci

这个会生成

`docker-compose.yml`, 容器相关

`rancher-compose.yml`, 编排相关

`build`, 镜像构建脚本

`upgrade` 服务升级脚本

此处可以提问

后续会继续完善做到完全自动发布。

### 项目模板的改造关键点

- env代替config

> 开发本地使用dotenv来进行配置，
>
>  打包运行后依赖容器的环境变量
> 
> 这样可以使代码更加“无状态”，配置管理更方便
> 
> 所以要求代码中有用到外部变量的都使用 process.env.XXX 方式

- /midlerwares  通用型中间件

	- cors 
	- error_handler

	> 兜底所有没有被catch的错误，建议业务上面尽量定义完整错误列表，此处只处理未定义的错误
	
	- traceId 
	
	> 串联上下游调用关系，后续日志统一收集后可以很好追踪链路
	
- /utils 通用型工具箱

	- common_field
	
	> Mongoose 插件式公共字段，在定义schema的地方使用
	
	- logger log4js
	
	> 避免使用console.log, 会阻塞
	>
	> 因为在app.js里已经挂到global
	>
	> 因此可以直接使用 log.info, log.warn, log.error, 日志信息会通过stream输出到指定文件
	
	
	- mongo
	
	> 一般不会引用，只会在 app.js 引用一次创建链接
	
	- redis
	
	> 只返回一个连接成功的 promise 化的redis-client,
	>
	> 如果需要针对业务特点进行封装，请在src里自行设计，此处不限制太多。
	
	- response
	
	> **重点！** 定义了success和error两个方法，
	>
	> 但是不提倡用中间件注册到ctx，
  >
	> 一来ctx每次会被销毁，二来希望统一一种方式处理返回
	>
	> 所以controller内部引入这个模块，使用 success / error处理结果。
	>
	> 使用 response.error 的时候不需要 单独 记录。

- test 测试

> 主体架构是 ava + superkoa(supertest)
> 
> 测试样例已经提供，可以照着写
> 
> package.json 已经写好，直接运行`npm test`即可

- src 业务相关的代码

	- /src/router.js
	
	> 这个文件不需要更改，请勿改动。
	>
	> 它会自动读取内层的 router 注册到 app
	
	- /src/{module}/v1 具体的业务逻辑集合
	
	> {module}主要是方便在一个系统内部在逻辑上归纳出几个部分，更多的时候因为服务拆分得足够小，只会有一两个module
	>
 	> 版本：这个 v1,v2 只是方便临时出现多版本兼容。常规来说应该在集群里启动不同版本的实例，通过反向代理实现多版本。 **重点**
	
	- /src/{module}/v1
	
	> 相对来说这层是业务强相关的，但还是提供了一点点约束
	>
	> controllers, middlewares,models,router.js 这些望文生义很好理解，简单看一下初始化的样例代码。
	>
	> 需要特别提醒一下，区别于最外面的middlewares，这一层的更偏重于具体业务。
	
	
	- error.js 是一个需要统一思路的环节。
	
	> 请参考样例代码来定义错误，这样可以在直接`throw`的时候有更好的统一处理。
	>
	> 错误码的规则，XXXYYY, 3位http语义分类，3位错误序列。调用方收到的是10位错误码，因为最前面还会加 4位 APPID
	>
	> 如 
	>
	> 1001404001 USER_NOT_FOUND
	>
	> 1001500002 INTERNAL_ERROR_2
	
	