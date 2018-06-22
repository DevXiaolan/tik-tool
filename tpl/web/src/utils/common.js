/*
 * @Author: Mr.He 
 * @Date: 2018-05-28 11:34:39 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-13 11:16:39
 */

import axios from "axios";


export function isMobile() {
    let userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf("mobile") > -1;
}

export async function getUserInfo(uid) {
    let axiosResult = await axios({
        url: BACK_SYSTEM_URL + "/v1/user/" + uid,
        method: "get",
        responseType: "json"
    });

    let result = axiosResult.data;
    if (result.code != 0) {
        return null;
    }

    return result.data;
}

/* 
getUserInfo = (item) => {
    return new Promise((resolve, reject) => {
        axios({
            url: BACK_SYSTEM_URL + "/v1/user/" + item.uid,
            method: "get",
            responseType: "json"
        }).then((resp) => {
            let result = resp.data;
            if (result.code != 0) {
                return item.userMobile = item.uid;
            }

            console.log(result);
            item.userMobile = result.data.auth.sms.mobile;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            resolve();
        });
    })
} */