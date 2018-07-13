import React, {Component} from 'react';
import {connect} from 'react-redux';
import {} from './action';

import './style.scss';
class App extends Component {
    constructor(props) {
        super(props);

        this.state={}
    }

    static propTypes =
    {
        
    }

    render() {
        let className = 'layoutApp';

        return(
             <div className={className}>
                 {/*header*/}


                 {/*body*/}
                 <div className={`${className}-body`}>
                     {this.props.children}
                 </div>

                 {/*footer*/}

            </div>
        )
    }
}

const mapStateToProps = state => ({
    reducer : state.layoutApp
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(App);