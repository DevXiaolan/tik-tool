const browserAttr = {
    versions:
    {
        // IE内核
        trident: navigator.userAgent.indexOf('Trident') > -1,
        // opera内核
        presto: navigator.userAgent.indexOf('Presto') > -1,
        // 苹果、谷歌内核
        webKit: navigator.userAgent.indexOf('AppleWebKit') > -1,
        // 火狐内核
        gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
        // 是否为移动终端
        mobile: !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/),
        // iOS终端
        ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        // Android终端
        android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
        // iOS或Android终端
        iosOrAndroid: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
        // 是否为iPhone或者QQHD浏览器
        iPhone: navigator.userAgent.indexOf('iPhone') > -1 ,
        // 是否iPad
        iPad: navigator.userAgent.indexOf('iPad') > -1,
        // 是否web应该程序，没有头部与底部
        webApp: navigator.userAgent.indexOf('Safari') == -1,
        // 是否微信
        weixin: navigator.userAgent.indexOf('MicroMessenger') > -1,
        // 是否QQ
        qq: navigator.userAgent.match(/\sQQ/i) == " qq"
    },
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

 export default browserAttr;