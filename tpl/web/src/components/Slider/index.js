import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Slider as SliderAntd} from 'antd';

import './style.scss';

class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    static propTypes =
    {
        // 风格
        styleName               :   React.PropTypes.oneOf(['deepPurple']),
    }

    render()
    {
        let props = {...this.props};

        let className = 'component-Slider';
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        if(this.props.styleName)
        {
            className += ` ${this.props.styleName}`;
        }

        return(
            <SliderAntd
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

export default connect(mapStateToProps, mapDispatchToProps)(Slider);