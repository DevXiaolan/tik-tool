import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Icon from 'components/Icon';
import {Spin} from 'antd';
import $ from 'jquery';
import './style.scss';

class Button extends Component {
    constructor(props) {
        super(props);

        // this.state = {...props};

        // 执行时间戳
        this.actionTime = null;
        // 是否点击
        this.isClick = false;
    }

    static propTypes =
    {
        // 按钮名
        name            :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element, React.PropTypes.array]),
        // 按钮名样式
        nameStyle       :   React.PropTypes.object,
        // 点击事件
        action          :   React.PropTypes.func,
        // 图标
        icon            :   React.PropTypes.element,
        // 图标样式
        iconStyle       :   React.PropTypes.object,
        // 是否显示侧边框
        isSideBorder    :   React.PropTypes.bool,
        // 侧边框大小
        sideBorderSize  :   React.PropTypes.oneOf(['full', 'half']),
        // 图标与按钮名是否一行
        isLine          :   React.PropTypes.bool,
        // 类型
        type            :   React.PropTypes.oneOf(['normal', 'weaken', 'white', 'null', 'think']),
        // 是否loading    (支持reducer写入: {reducer, isLoading})
        isLoading       :   React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.object])
    }

    static defaultProps =
    {
        // 点击事件
        action          :   () => {},
        // 类型
        type            :   'normal',
        // 是否显示侧边框
        isSideBorder    :   false,
        // 侧边框大小
        sideBorderSize  :   'full',
        // 图标与按钮名是否一行
        isLine          :   true,
        // 是否loading
        isLoading       :   false
    }

    onDown = e => {
        e.preventDefault();
        this.isClick = true;
    }

    onUp = e => {
        const thisTime = new Date().getTime();
        if(!this.actionTime || thisTime - this.actionTime  > 50)
        {
            this.actionTime = thisTime;

            if(this.isClick)
            {
                setTimeout(() => {
                    this.props.action();
                    // this.actionSet(this.props.action(this.actionSet));
                }, 10);
            }
        }
    }

    // actionSet = newState => {
    //     if(newState)
    //     {
    //         this.setState({...this.state, ...newState});
    //     }
    // }

    render()
    {
        let className = 'component-Button';
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }
        if(this.props.type)
        {
            componentClassName += ` ${className}-${this.props.type}`;
        }
        if(this.props.isSideBorder)
        {
            componentClassName += ` ${className}-sideBorder ${className}-${this.props.sideBorderSize}`;
        }

        let isLoading = this.props.isLoading;
        if($.type(isLoading) == 'object')
        {
            isLoading = this.props.reducers[isLoading.reducer][isLoading.isLoading] || false;
        }

        return(
            <div className={componentClassName} style={this.props.style}>
                <Spin spinning={isLoading}>
                    <div className={`${className}-content ${this.props.isLine ? `${className}-line` : ''}`}
                         onTouchStart={this.onDown}
                         onTouchMove={e => this.isClick = false}
                         onTouchEnd={this.onUp}
                         onMouseDown={this.onDown}
                         onMouseMove={e => this.isClick = false}
                         onMouseUp={this.onUp}
                    >
                        {
                            this.props.icon
                                ?
                                <div className={`${className}-icon`}>
                                    <div className={`${className}-icon-border`} style={this.props.iconStyle}>
                                        {this.props.icon}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            this.props.name
                                ?
                                <div className={`${className}-name`} style={this.props.nameStyle}>
                                    {this.props.name}
                                </div>
                                :
                                null
                        }
                    </div>
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    reducers : {...state}
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Button);
