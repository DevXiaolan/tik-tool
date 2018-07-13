import configLocal from 'config/local';

let server = null;
if (process.env.NODE_ENV !== 'development') {
    server = 'http://app.tap4fun.com';
} else {
    server = configLocal.SERVER;
}

export const SERVER = server;
