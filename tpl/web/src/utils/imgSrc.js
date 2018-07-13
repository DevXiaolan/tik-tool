const getSrc = url => {
    if(url.indexOf('http') == 0)
    {
        return url;
    }
    else
    {
        return require(`assets/image/${url}`);
    }
}

 export default getSrc;