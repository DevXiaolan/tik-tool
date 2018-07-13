import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectReducer} from 'store/reducers';

import {} from './action';

import './style.scss';

class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentWillMount() {

    }

    render() {
        let className = 'routeTest';
        // this.props.params.test}{this.props.state.message

        return(
            <div className={className}>
                <div className={`${className}-message`}>
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    // TODO: 能不能统一成1个
    state : state.routeTest,
    publicState : state.layoutApp
})

const mapDispatchToProps = {
}

export default store => ({
    path: '/test/:test',
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            injectReducer(store, {key : 'routeTest', reducer : require('./reducer').default});
            cb(null, connect(mapStateToProps, mapDispatchToProps)(Test))
        }, 'routeTest')
    }
})
