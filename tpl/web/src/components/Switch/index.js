import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Switch as SwitchAntd} from 'antd-mobile';
import browserAttr from 'utils/browserAttr';

import './style.scss';

class Switch extends Component {
    static propTypes =
    {

    }

    render()
    {
        let props = {...this.props};

        let className = 'component-Switch';
        if(props.disabled || props.editable == false)
        {
            className += ' component-Switch-readonly';
        }
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        return(
            <SwitchAntd
                {...props}
                className={className}
            />
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Switch);