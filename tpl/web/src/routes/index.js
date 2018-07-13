import {injectReducer} from '../store/reducers';

// layout
import LayoutAppReducer from '../layouts/App/reducer';
import LayoutApp from '../layouts/App';

// 页面
import Index from './Index/index';
import Test from './Test';



export const createRoutes = (store) => [
    {
        path : '/',
        indexRoute : Index(store),
        childRoutes : [
            // 子路由
            Test(store),
        ],
        getComponent (nextState, cb) {
            require.ensure([], (require) => {
                injectReducer(store, {key : 'LayoutApp', reducer : LayoutAppReducer});
                cb(null, LayoutApp);
            }, 'LayoutApp')
        }

    },
]

export default createRoutes;
