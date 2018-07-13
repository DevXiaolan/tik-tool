import {ACTION_TYPES} from './action';

const initialState = {
    message: 'This is the Test'
}

export default (state = initialState, action) => {
    let newState = state;
    switch (action.type) {

    }

    return {...newState};
}