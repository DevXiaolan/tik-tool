import CONFIG from 'config/app';

const getUrl = url => {
    return `${document.location.origin}${url}${CONFIG.DD_URL_PARAM}`;
}

export default getUrl;