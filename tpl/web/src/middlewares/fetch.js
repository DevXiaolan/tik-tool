import fetch from 'isomorphic-fetch';
import param from '../utils/param';
import keyMirror from 'keymirror';
import {Cookies} from 'react-cookie';

export const CALL_API = Symbol('CALL_API');
// 返回reducer的action请求类型
export const ACTION_TYPES = keyMirror({
    // 服务器错误
    FETCH_SERVER_ERROR : null
});

/**
 * 模拟Promise 类
 *
 * 该类实现自动给传入的promise实例，调用then 方法时，主动加入了一个onReject参数 promise.then(onResolve, onReject)
 * 同时支持自定义传入catch方法 或者 onReject 函数
 * 可以解决不传入onReject函数，或导致JS报错的问题
 * 构造函数需要传入一个Promise实例作为，初始化条件
 */
class PromiseSimulator
{
    constructor(promise)
    {
        if (!promise) throw new Error(`Promise instance required.`);
        this.promise = promise;
    }

    loop(e)
    {
        this.catchedError = e;
    }

    then(then, catchFn)
    {
        if(!catchFn)
        {
            catchFn = (e) => this.loop(e);
        }

        this.promise.then(then, catchFn);
        return this;
    }

    catch(catchFn)
    {
        this.promise.catch(catchFn);
        return this;
    }
}

const checkStatus = async (response) =>
{
    if(response.status >= 200 && response.status < 300)
    {
        return response;
    }
    else
    {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

const remote = (options) =>
{
    let fetchOptions = {};
    options.method = options.method || 'POST';
    const method = options.method.toUpperCase();

    fetchOptions.headers =
    {
        'Content-type': method === 'GET' ? 'application/x-www-form-urlencoded; charset=utf-8' : 'application/json',
        'mode': 'cors',
        'Authorization': options.accessToken
    }
    fetchOptions.credentials = 'include';

    if (options.contentType) {
        fetchOptions.headers['Content-type'] = options.contentType;
    }

    const params =
    {
        ...options.data,
        ...options.urlParam
    }

    let concatStr = '?',
        queryStr = param(params);

    if(options.url.indexOf(concatStr) > -1)
    {
        concatStr = '&';
    }

    if(queryStr)
    {
        if(method === 'GET')
        {
            options.url += (concatStr + queryStr);
        }
        else
        {
            fetchOptions.body =JSON.stringify(params);
        }
    }

    fetchOptions.method = options.method;

    let t = fetch(options.url, fetchOptions)
        .then(checkStatus)
        .then(res => res.json())
        .then(json =>
        {
            return json || {};
        })
        .catch(
            e => {
                if(e && e.response && e.response.status === 403)
                {
                    // window.location.hash = '/forbidden';
                    console.log(e);
                }
                else
                {
                    // !options.hideError && Toast.fail(e.message, 2);
                    console.log(e);
                }
                return Promise.reject(e);
            }
        );

    return new PromiseSimulator(t);
}

export default store => next => action =>
{
    const callAPI = action[CALL_API];

    // 按照普通的 Action 处理
    if(typeof callAPI === 'undefined')
    {
        return next(action);
    }

    // 参数
    let {
        // request url
        url,
        // Content-type
        contentType,
        // request dataType 默认为json
        type,
        // request data
        data,
        // url参数
        urlParam,
        // 异常
        hideError,
        // 中间参数,该参数不会被提交到request,在reducer里可获取
        args,
        // request method 默认为POST
        method,
        // 请求成果回调函数 result => {}
        success,
        // 请求失败回调函数 result => {}
        fail
    } = callAPI;
    if(!type) type = Date.now();

    const createNewAction = data =>
    {
        let newAction =
        {
            ...action,
            ...data
        }
        delete newAction[CALL_API];
        return newAction;
    }

    // 返回reducer的action类型:[请求, 成功, 失败]
    let [requestingType, successType, failType] = [`REQUESTING_${type}`, type, `FAIL_${type}`];

    next(createNewAction({
        type: requestingType,
        args,
        request: data,
        urlParam
    }));

    const remoteRun = accessToken => {
        remote({
            url,
            data,
            urlParam,
            hideError,
            method,
            accessToken
        }).then(
            // 当前返回格式形如:
            // {
            // 状态码 [0 : 成功, 其他 : 失败]
            //         code : 0,
            // 状态描述
            //         message : 'SUCCESS'
            // 返回值
            //     data : {}
            // }
            r => {
                switch (r.code)
                {
                    // 登录已过期
                    case 1003401001:
                        // next(createNewAction({
                        //     type : PUBLIC_ACTION_TYPES.PUBLIC_UPDATE_LOGIN_INFO,
                        //     data : {userStatus: -1, userInfo: {}}
                        // }));
                        fail && fail(r.data, r.message, r.code);
                        next(createNewAction({
                            type: failType,
                            data: r.data,
                            code: r.code,
                            message: r.message,
                            args,
                            urlParam,
                            request: data
                        }));
                        break;
                    // 成功
                    case 0:
                        success && success(r.data, r.message, r.code);
                        next(createNewAction({
                            type: successType,
                            data: r.data,
                            message: r.message,
                            args,
                            urlParam,
                            request : data
                        }));
                        break;
                    // 失败
                    default:
                        fail && fail(r.data, r.message, r.code);
                        next(createNewAction({
                            type: failType,
                            data: r.data,
                            code: r.code,
                            message: r.message,
                            args,
                            urlParam,
                            request: data
                        }));
                        break;
                }
            }
        ).catch(
            e => {
                next(createNewAction({
                    type: ACTION_TYPES.FETCH_SERVER_ERROR,
                    error: e,
                    request: data
                }));
            }
        );
    }

    // TODO 'ACCESS_TOKEN' 应做全局配置
    return remoteRun(Cookies.get('ACCESS_TOKEN'));
}
