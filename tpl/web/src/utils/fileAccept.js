
export const getFileAccepts = suffixes => {
    suffixes = suffixes.split(',');
    let accepts = [];

    for (var key in suffixes) {
        accepts.push(getFileAccept(suffixes[key]));
    }

    return accepts;
}

/**
 * 是否是图片
 * @param suffix    文件后缀
 */
export const isImageForSuffix = suffix => {
    return 'image/jpeg,image/gif,image/png'.indexOf(getFileAccept(suffix)) != -1;
}

/**
 * 是否是图片
 * @param accept    文件类型
 */
export const isImageForAccept = accept => {
    return 'image/jpeg,image/gif,image/png'.indexOf(accept) != -1;
}

const getFileAccept = suffix => {
    switch(suffix.toLowerCase())
    {
        case '3gpp':
            return 'audio/3gpp, video/3gpp';
        case 'ac3':
            return 'audio/ac3';
        case 'asf':
            return 'allpication/vnd.ms-asf';
        case 'au':
            return 'audio/basic';
        case 'css':
            return 'text/css';
        case 'csv':
            return 'text/csv';
        case 'doc':
        case 'dot':
            return 'application/msword';
        case 'dtd':
            return 'application/xml-dtd';
        case 'dwg':
            return 'image/vnd.dwg';
        case 'dxf':
            return 'image/vnd.dxf';
        case 'gif':
            return 'image/gif';
        case 'htm':
        case 'html':
            return 'text/html';
        case 'jp2':
            return 'image/jp2';
        case 'jpe':
        case 'jpeg':
        case 'jpg':
            return 'image/jpeg';
        case 'js':
            return 'text/javascript, application/javascript';
        case 'json':
            return 'application/json';
        case 'mp2':
            return 'audio/mpeg, video/mpeg';
        case 'mp3':
        case 'mpeg':
        case 'mpg':
            return 'audio/mpeg';
        case 'mp4':
            return 'audio/mp4, video/mp4';
        case 'avi':
            return 'video/x-msvideo';
        case 'mov':
            return 'video/quicktime';
        case 'mpp':
            return 'application/vnd.ms-project';
        case 'ogg':
            return 'application/ogg, audio/ogg';
        case 'pdf':
            return 'application/pdf';
        case 'png':
            return 'image/png';
        case 'pot':
        case 'pps':
        case 'ppt':
            return 'application/vnd.ms-powerpoint';
        case 'rtf':
            return 'application/rtf, text/rtf';
        case 'svf':
            return 'image/vnd.svf';
        case 'tif':
        case 'tiff':
            return 'image/tiff';
        case 'txt':
            return 'text/plain';
        case 'wdb':
        case 'wps':
            return 'application/vnd.ms-works';
        case 'xhtml':
            return 'application/xhtml+xml';
        case 'xlc':
        case 'xlm':
        case 'xls':
        case 'xlt':
        case 'xlw':
            return 'application/vnd.ms-excel';
        case 'xml':
            return 'text/xml, application/xml';
        case 'zip':
            return 'aplication/zip';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        default :
            return '';
    }
}
