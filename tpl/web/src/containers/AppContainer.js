import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory, Router} from 'react-router';
import {Provider} from 'react-redux';
import fastClick from 'fastclick';

class AppContainer extends Component {
    static propTypes = {
        routes : PropTypes.array.isRequired,
        store : PropTypes.object.isRequired
    }

    componentDidMount() {
        fastClick.attach(document.body);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const {routes, store} = this.props;

        return (
            <Provider store={store}>
                <div style={{height : '100%'}}>
                    <Router history={browserHistory} children={routes}/>
                </div>
            </Provider>
        )
    }
}

export default AppContainer;
