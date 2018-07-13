import {SERVER} from './server';
import user from './apis/user';

export default {
    SERVER,
    ...user(SERVER)
};