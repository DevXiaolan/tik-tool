import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import './style.scss';

class ToastContent extends Component {
    static propTypes =
    {
        // 图标
        icon        : React.PropTypes.element,
        // 类型
        type        : React.PropTypes.oneOf(['success', 'fail', 'warning', 'info', 'loading', 'offline']),
        // 内容
        content     : React.PropTypes.oneOfType([React.PropTypes.string.isRequired, React.PropTypes.element.isRequired, React.PropTypes.array.isRequired])
    }

    render()
    {
        let icon = this.props.icon;
        if(!icon)
        {
            const type = this.props.type || 'info';
            switch (type)
            {
                case 'success':
                    icon = <div><Icon className={type} type="check" /><br/></div>;
                    break;
                case 'fail':
                    icon = <div><Icon className={type} type="remove" /><br/></div>;
                    break;
                case 'warning':
                    icon = <div><Icon className={type} type="exclamation-triangle" /><br/></div>;
                    break;
                case 'info':
                    icon = <div><Icon className={type} type="commenting" /><br/></div>;
                    break;
                case 'loading':
                    icon = <div><Icon className={`${type} fa-spin`} type="spinner" /><br/></div>;
                    break;
                case 'offline':
                    icon = <div><Icon className={type} type="frown-o" /><br/></div>;
                    break;
            }
        }

        let className = 'component-ToastContent';
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        return(
            <div className={className} style={this.props.style}>
                {icon}
                {this.props.content}
            </div>
        )
    }
}

export default ToastContent;
