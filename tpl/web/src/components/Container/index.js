import React, {Component, PropTypes} from 'react';
import './style.scss';

class Container extends Component {
    static propTypes =
    {
        // 宽度
        width            :   React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    }

    static defaultProps =
    {
        width           :   600
    }

    render()
    {
        let className = `component-Container`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        return(
            <div className={componentClassName} style={{...this.props.style, maxWidth : this.props.width}}>
                {this.props.children}
            </div>
        )
    }
}

export default Container;
