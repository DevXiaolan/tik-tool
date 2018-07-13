import $ from 'jquery';
import keyMirror from 'keymirror';

export const CALL_API = Symbol('CALL_API');
// 返回reducer的action请求类型
export const ACTION_TYPES = keyMirror({
    // 服务器错误
    FETCH_SERVER_ERROR : null
});

const remote = (options, success, error) =>
{
    let fetchOptions = {};
    options.method = options.method || 'POST';

    fetchOptions.headers =
    {
        'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    fetchOptions.xhrFields =
    {
        'withCredentials' : true
    }
    fetchOptions.type = options.method;
    fetchOptions.data = {...options.data, ...options.urlParam};
    fetchOptions.url = options.url;
    fetchOptions.dataType = 'json';

    $.ajax({
        ...fetchOptions,
        success,
        error
    });
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
    let {url, type, data, urlParam, method, hideError, success, fail, args} = callAPI;

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
    let [requestType, successType, failType] = [`REQUEST_${type}`, type, `FAIL_${type}`];

    next(createNewAction({
        type : requestType,
        args,
        request : data,
        urlParam
    }));

    return remote({
        url,
        data,
        urlParam,
        hideError,
        method
    }, (r , textStatus, jqXHR) => {
        // 当前返回格式形如:
        // {
        // 返回状态
        //     status : {
        // 状态码 [0 : 成功, 其他 : 失败]
        //         code : 0,
        // 状态描述
        //         message : 'SUCCESS'
        //     }
        // 返回值
        //     data : {}
        // }
        // 具体可自行调整
        switch (r.status.code)
        {
            // 未登录
            case -1:
                break;
            // 成功
            case 0:
                success && success(r.data, r.status);
                next(createNewAction({
                    type : successType,
                    data : r.data,
                    status : r.status,
                    args,
                    urlParam,
                    request : data
                }));
                break;
            // 失败
            default:
                fail && fail(r.status, r.data);
                next(createNewAction({
                    type : failType,
                    data : r.data,
                    status : r.status,
                    args,
                    urlParam,
                    request : data
                }));
                break;
        }
    }, (e, textStatus, errorThrown) => {
        // alert(e.status)
        console.log(e)
        next(createNewAction({
            type : ACTION_TYPES.FETCH_SERVER_ERROR,
            error : e,
            request : data
        }));
    });
}
