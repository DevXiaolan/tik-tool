import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import $ from 'jquery';
import './style.scss';

class Text extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lockDisplay     :   'block',
            lockState       :   'show'
        };
        // 行高
        this.lineHeight = this.getLineHeight(props.fontSize);
    }

    static propTypes =
    {
        // 字体大小
        fontSize            :   React.PropTypes.number,
        // 行数
        lineNum             :   React.PropTypes.number,
        // 将要展开或者收起回调,接收一个当前状态,返回false将不执行
        readyChangeLock     :   React.PropTypes.func,
        // 完成展开或者收起回调,接收一个当前状态
        finishChangeLock    :   React.PropTypes.func,
        // 下边距
        marginBottom        :   React.PropTypes.number,
        // 左边距
        marginLeft          :   React.PropTypes.number,
        // 文本点击事件
        onClickText         :   React.PropTypes.func,
        // 文本类名
        textClassName       :   React.PropTypes.string
    }

    static defaultProps =
    {
        // 字体大小
        fontSize            :   12,
        // 行数
        lineNum             :   3,
        // 将要展开或者收起回调,接收一个当前状态,返回false将不执行
        readyChangeLock     :   lock => {},
        // 完成展开或者收起回调,接收一个当前状态
        finishChangeLock    :   lock => {},
        // 下边距
        marginBottom        :   0,
        // 左边距
        marginLeft          :   0,
        // 文本点击事件
        onClickText         :   () => {}
    }

    componentDidMount() {
        let display = 'block';
        if($(this.text).height() <= this.lineHeight * this.props.lineNum)
        {
            display = 'none';
        }
        this.setState({lockDisplay : display});
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.fontSize)
        {
            // 行高
            this.lineHeight = this.getLineHeight(nextProps.fontSize);
        }
    }

    /**
     * 获取行高
     * @param fontSize  字体大小
     * @returns {*}
     */
    getLineHeight = fontSize => {
        return fontSize + 8;
    }

    /**
     * 改变展开状态
     */
    changeLock = () => {
        const lockState = this.state.lockState == 'show' ? 'hide' : 'show';
        if(!(this.props.readyChangeLock(this.state.lockState) === false))
        {
            this.setState({lockState});
            setTimeout(() => {
                this.props.finishChangeLock(lockState);
            }, 600);
        }
    }

    render()
    {
        let className = `component-Text`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let textStyle = {
            fontSize        : this.props.fontSize,
            lineHeight      : `${this.lineHeight}px`
        };
        let ellipsisStyle = {
            ...textStyle,
            width : this.props.fontSize,
            marginLeft : $(this.text).width() - this.props.fontSize || 0,
            marginTop : this.lineHeight * (this.props.lineNum - 1)
        };

        if(this.state.lockDisplay == 'none')
        {
            textStyle.height = 'auto';
            ellipsisStyle.display = 'none';
        }
        else if(this.state.lockState == 'show')
        {
            textStyle.height = this.lineHeight * this.props.lineNum;
        }
        else if(this.state.lockState == 'hide')
        {
            textStyle.height = $(this.text).height();
            ellipsisStyle.display = 'none';
        }

        let lockStyle = {};
        if(this.props.marginBottom != 0)
        {
            lockStyle.marginBottom = this.props.marginBottom;
        }
        let iconStyle = {};
        if(this.props.marginLeft != 0)
        {
            iconStyle.marginLeft = this.props.marginLeft;
        }

        let textClassName = `${className}-text`;
        if(this.props.textClassName)
        {
            textClassName += ` ${this.props.textClassName}`;
        }

        return(
            <div className={componentClassName} style={this.props.style}>
                <div className={`${className}-text-border`} style={textStyle} onClick={this.props.onClickText}>
                    {/*<div className={`${className}-ellipsis`} style={ellipsisStyle}>...</div>*/}
                    <div className={textClassName} ref={e=>this.text=e}>
                        <div dangerouslySetInnerHTML={{__html:this.props.children && this.props.children.replace(/\n/g,"<br />")}}></div>
                    </div>
                </div>
                <div className={`${className}-lock`} style={{display : this.state.lockDisplay, ...lockStyle}} onClick={this.changeLock}>
                    <Icon type={this.state.lockState == 'show' ? 'angle-down' : 'angle-up'} style={iconStyle} />
                </div>
            </div>
        )
    }
}

export default Text;
