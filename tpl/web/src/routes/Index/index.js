import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectReducer} from 'store/reducers';

import {} from './action';

import './style.scss';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentWillMount() {

    }

    render() {
        let className = 'routeIndex';

        return(
            <div className={className}>
                <div className={`${className}-message`}>1{this.props.state.message}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state : state.routeIndex,
    publicState : state.layoutApp
})

const mapDispatchToProps = {

}

export default store => ({
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            injectReducer(store, {key : 'routeIndex', reducer : require('./reducer').default});
            cb(null, connect(mapStateToProps, mapDispatchToProps)(Index))
        }, 'routeIndex')
    }
})
