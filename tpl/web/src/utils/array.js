/**
 * 字符串数组新增
 * @param str   数据
 * @param val   值
 * @param isRepeat  是否可重复
 * @returns {boolean[]} [新数据, 是否新增]
 */
export const addStr = (str, val, isRepeat=false) => {
    if(!isRepeat && selectForValStr(str, val)[0])
    {
        return [str, false];
    }

    return [str ? `${str},${val}` : val, true];
}

/**
 * 字符串数组查找--依赖值
 * @param str   数据
 * @param val   值
 * @returns {boolean[]}     [是否找到, 键]
 */
export const selectForValStr = (str, val) => {
    if(!str)
    {
        return [false];
    }

    let result = [false];

    str = (str + '').split(',');
    str.map((v, k) => {
        if(v == val)
        {
            result = [true, k];
            return false;
        }
    });

    return result;
}

/**
 * 字符串数组删除
 * @param str   原数据
 * @param val   删除值
 * @param isAll 是否删除所有删除值
 * @returns {*[]}   [新数据, 删除个数]
 */
export const deleteStr = (str, val, isAll=true) => {
    if(!str)
    {
        return [str, 0];
    }

    let num = 0;
    str = (str + '').split(',');
    let newStr = null;

    str.map((v, k) => {
        if(v == val && (isAll || num == 0))
        {
            num++;
        }
        else
        {
            newStr = newStr == null ? v : `${newStr},${v}`;
        }
    });

    return [newStr, num];
}

/**
 * 对象数组删除
 * @param array     原数据
 * @param key       删除对象键
 * @param val       删除对象值
 * @param isAll     是否删除所有删除值
 * @returns  [新数据, 删除个数]
 */
export const deleteArray = (array, key, val, isAll=true) => {
    if(!array || array.length == 0)
    {
        return [array, 0]
    }

    let num = 0;
    let newArray = [];

    array.map((v, k) => {
        if(v[key] == val && (isAll || num == 0))
        {
            num++;
        }
        else
        {
            newArray.push(v);
        }
    });

    return [newArray, num];
}