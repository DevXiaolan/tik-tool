import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import {Spin} from 'antd';
import './style.scss';

class ActionButton extends Component {
    static propTypes =
    {
        // 按钮名
        name        : React.PropTypes.string.isRequired,
        // 点击事件
        action      : React.PropTypes.func.isRequired,
        // 图标
        icon        : React.PropTypes.element,
        // 类型
        type        : React.PropTypes.oneOf(['primary', 'warning', 'danger']),
        // 是否loading
        isLoading   : React.PropTypes.bool
    }

    static defaultProps =
    {
        // 图标
        icon        : <Icon type="cloud-upload" />,
        // 类型
        type        : 'primary',
        // 是否loading
        isLoading   : false
    }

    render()
    {
        let className = `component-ActionButton`;
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        return(
            <div className={className} style={this.props.style}>
                <Spin spinning={this.props.isLoading}>
                    <div className="component-ActionButton-content" onClick={this.props.action}>
                        <div className={`icon ${this.props.type}`}>
                            {this.props.icon}
                        </div>
                        <div className="name">
                            {this.props.name}
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}

export default ActionButton;
