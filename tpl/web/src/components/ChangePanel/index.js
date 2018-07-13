import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import 'jquery-easing';

import './style.scss';

class ChangePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        // key记录
        this.thisKey = null;
        // children
        this.children = null;
    }

    static propTypes =
    {
        // 变换key列表
        changeKeys              :   React.PropTypes.array.isRequired,
        // 当前key
        thisKey                 :   React.PropTypes.string.isRequired
    }

    static defaultProps =
    {

    }

    render()
    {
        let className = `component-ChangePanel`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        if($.inArray(this.props.thisKey, this.props.changeKeys) >= 0 && this.props.thisKey != this.thisKey)
        {
            this.children = this.props.children;
        }

        return (
            <div className={componentClassName} style={this.props.style}>
                {this.children}
            </div>
        );
    }
}

export default ChangePanel;
