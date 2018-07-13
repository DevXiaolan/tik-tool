import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import 'jquery-easing';

import {getLocation, getPosition} from 'utils/location';

import './style.scss';

class Show extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        // 当前状态
        this.status = null;
        // 默认隐藏样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        this.defaultHideStyle = {width : 0, height : 0, marginLeft : 'border', marginTop : 'border', display : 'none'};
        // 默认显示样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        this.defaultShowStyle = {display : 'block'};
    }

    static propTypes =
    {
        // 相对区域宽
        areaWidth           :   React.PropTypes.number,
        // 相对区域高
        areaHeight          :   React.PropTypes.number,
        // 画布宽
        canvasWidth         :   React.PropTypes.number,
        // 状态
        status              :   React.PropTypes.oneOf(['wait', 'show', 'hide']),
        // 超出是否可见
        overflowIsVisible   :   React.PropTypes.bool,
        // 开始回调
        onStart             :   React.PropTypes.func,
        // 完成回调
        onEnd               :   React.PropTypes.func,
        // 隐藏样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        hideStyle           :   React.PropTypes.object,
        // 隐藏比例 (auto依赖相对区域高计算)
        hideScale           :   React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.oneOf(['auto'])]),
        // 隐藏延迟 (ms)
        hideOffsetTime      :   React.PropTypes.number,
        // 隐藏时间 (ms)
        hideDuration        :   React.PropTypes.number,
        // 隐藏动画名
        hideAnimateName     :   React.PropTypes.oneOf([
            'linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
            'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc',
            'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce']),
        // 显示样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        showStyle           :   React.PropTypes.object,
        // 显示比例 (auto依赖相对区域高计算)
        showScale           :   React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.oneOf(['auto'])]),
        // 显示延迟 (ms)
        showOffsetTime      :   React.PropTypes.number,
        // 显示时间 (ms)
        showDuration        :   React.PropTypes.number,
        // 显示动画名
        showAnimateName     :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
            'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc',
            'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce']),
        // 存在动画相对样式 (margin,top,left,right,bottom均相对显示样式)
        existAnimateStyle   :   React.PropTypes.object,
        // 存在相对比例
        existAnimateScale   :   React.PropTypes.number,
        // 存在动画时间 (ms)
        existAnimateDuration:   React.PropTypes.number,
        // 存在动画名
        existAnimateName    :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
            'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc',
            'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce']),
        // 存在动画是否往复
        existAnimateIsBack  :   React.PropTypes.bool
    }

    static defaultProps =
    {
        // 相对区域宽
        areaWidth           :   $(window).width(),
        // 相对区域高
        areaHeight          :   $(window).height(),
        // 画布宽
        canvasWidth         :   750,
        // 状态
        status              :   'show',
        // 超出是否可见
        overflowIsVisible   :   false,
        // 开始回调
        onStart             :   () => {},
        // 完成回调
        onEnd               :   () => {},
        // 隐藏样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        hideStyle           :   {width : 0, height : 0, marginLeft : 'border', marginTop : 'border', display : 'none'},
        // 隐藏比例 (auto依赖相对区域高计算)
        hideScale           :   1,
        // 隐藏延迟 (ms)
        hideOffsetTime      :   0,
        // 隐藏时间 (ms)
        hideDuration        :   10,
        // 隐藏动画名
        hideAnimateName     :   'linear',
        // 显示样式 (marginLeft为border时为相对区域右边;marginTop为border时为相对区域下边)
        showStyle           :   {display : 'block'},
        // 显示比例 (auto依赖相对区域高计算)
        showScale           :   1,
        // 显示延迟 (ms)
        showOffsetTime      :   0,
        // 显示时间 (ms)
        showDuration        :   1000,
        // 显示动画名
        showAnimateName     :   'linear',
        // 存在动画相对样式 (margin,top,left,right,bottom均相对显示样式)
        existAnimateStyle   :   null,
        // 存在相对比例
        existAnimateScale   :   0,
        // 存在动画时间 (ms)
        existAnimateDuration:   1000,
        // 存在动画名
        existAnimateName    :   'linear',
        // 存在动画是否往复
        existAnimateIsBack  :   true
    }

    componentDidMount() {
        // 初始隐藏
        this.hide(true);
    }

    /**
     * 适配样式
     * @param style 样式
     */
    adaptation = style => {
        const scale = this.props.areaWidth / this.props.canvasWidth;
        if(style.width) style.width *= scale;
        if(style.height) style.height *= scale;
        if(style.marginLeft) style.marginLeft = style.marginLeft == 'border' ? this.props.areaWidth : style.marginLeft * scale;
        if(style.marginTop) style.marginTop = style.marginTop == 'border' ? this.props.areaHeight : style.marginTop * scale;
        if(style.marginRight) style.marginRight *= scale;
        if(style.marginBottom) style.marginBottom *= scale;
        if(style.left) style.left *= scale;
        if(style.top) style.top *= scale;
        if(style.right) style.right *= scale;
        if(style.bottom) style.bottom *= scale;

        return style;
    }

    /**
     * 缩放样式
     * @param style 样式
     * @param scale 缩放比例
     */
    scale = (style, scale) => {
        const addX = style.width * (1 - scale) / 2;
        const addY = style.height * (1 - scale) / 2;
        style.width *= scale;
        style.height *= scale;
        if(style.marginLeft != 'border') style.marginLeft += addX;
        if(style.marginTop != 'border') style.marginTop += addY;
        if(style.marginRight) style.marginRight += addX;
        if(style.marginBottom) style.marginBottom += addY;
        if(style.left) style.left += addX;
        if(style.top) style.top += addY;
        if(style.right) style.right += addX;
        if(style.bottom) style.bottom += addY;

        return style;
    }

    /**
     * 隐藏
     * @param isInit 是否初始化
     */
    hide = (isInit = false) => {
        // 样式
        let hideStyle = {...this.defaultHideStyle, ...this.props.hideStyle};
        // 适配
        hideStyle = this.adaptation(hideStyle);
        // 缩放
        hideStyle = this.scale(hideStyle, this.props.hideScale == 'auto' ? (this.props.areaHeight - hideStyle.marginTop) / this.props.areaHeight : this.props.hideScale);

        if(!isInit)
        {
            this.props.onStart(this.status);
            $(this.domShow).finish().animate(hideStyle, this.props.hideDuration, this.props.hideAnimateName, () => {
                $(this.domShow).css('display' , hideStyle.display);
                this.props.onEnd(this.status);
            });
        }
        else
        {
            $(this.domShow).css(hideStyle);
        }
    }

    /**
     * 显示
     * @param isAnimate 是否动画
     */
    show = () => {
        // 样式
        let showStyle = {...this.defaultHideStyle, ...this.props.hideStyle, ...this.defaultShowStyle, ...this.props.showStyle};
        // 适配
        showStyle = this.adaptation(showStyle);
        // 缩放
        showStyle = this.scale(showStyle, this.props.showScale == 'auto' ? (this.props.areaHeight - showStyle.marginTop) / this.props.areaHeight : this.props.showScale);

        this.props.onStart(this.status);
        $(this.domShow).finish().css('display' , showStyle.display).animate(showStyle, this.props.showDuration, this.props.showAnimateName, () => {
            this.props.onEnd(this.status)
            // 存在动画
            this.existAnimatePositive();
        });
    }

    // 存在动画-正向
    existAnimatePositive = () => {
        if(this.status == 'show' && (this.props.existAnimateStyle || this.props.existAnimateScale != 0))
        {
            const showStyle = {...this.defaultHideStyle, ...this.props.hideStyle, ...this.defaultShowStyle, ...this.props.showStyle};
            let style = null;
            if(this.props.existAnimateStyle)
            {
                style = {width : showStyle.width, height : showStyle.height, marginLeft : showStyle.marginLeft, marginTop : showStyle.marginTop, ...this.props.existAnimateStyle};

                if(this.props.existAnimateStyle.marginTop && showStyle.marginTop != 'border') style.marginTop += showStyle.marginTop;
                if(this.props.existAnimateStyle.marginBottom && showStyle.marginBottom) style.marginBottom += showStyle.marginBottom;
                if(this.props.existAnimateStyle.marginLeft && showStyle.marginLeft != 'border') style.marginLeft += showStyle.marginLeft;
                if(this.props.existAnimateStyle.marginRight && showStyle.marginRight) style.marginRight += showStyle.marginRight;

                if(this.props.existAnimateStyle.top && showStyle.top) style.top += showStyle.top;
                if(this.props.existAnimateStyle.bottom && showStyle.bottom) style.bottom += showStyle.bottom;
                if(this.props.existAnimateStyle.left && showStyle.left) style.left += showStyle.left;
                if(this.props.existAnimateStyle.right && showStyle.right) style.right += showStyle.right;
            }
            else
            {
                style = {...showStyle};
            }

            // 适配
            style = this.adaptation(style);
            // 缩放
            style = this.scale(style, 1 + this.props.existAnimateScale);

            $(this.domShow).finish().animate(style, this.props.existAnimateDuration, this.props.existAnimateName, this.props.existAnimateIsBack ? this.existAnimateReverse : null);
        }
    }

    // 存在动画-反向
    existAnimateReverse = () => {
        if(this.status == 'show' && (this.props.existAnimateStyle || this.props.existAnimateScale != 0))
        {
            const showStyle = {...this.defaultHideStyle, ...this.props.hideStyle, ...this.defaultShowStyle, ...this.props.showStyle};
            let style = null;
            if(this.props.existAnimateStyle)
            {
                style = {width : showStyle.width, height : showStyle.height, marginLeft : showStyle.marginLeft, marginTop : showStyle.marginTop, ...this.props.existAnimateStyle};

                if(this.props.existAnimateStyle.marginTop) style.marginTop = showStyle.marginTop - style.marginTop;
                if(this.props.existAnimateStyle.marginBottom && showStyle.marginBottom) style.marginBottom = showStyle.marginBottom - style.marginBottom;
                if(this.props.existAnimateStyle.marginLeft) style.marginLeft = showStyle.marginLeft - style.marginLeft;
                if(this.props.existAnimateStyle.marginRight && showStyle.marginRight) style.marginRight = showStyle.marginRight - style.marginRight;

                if(this.props.existAnimateStyle.top && showStyle.top) style.top = showStyle.top - style.top;
                if(this.props.existAnimateStyle.bottom && showStyle.bottom) style.bottom = showStyle.bottom - style.bottom;
                if(this.props.existAnimateStyle.left && showStyle.left) style.left = showStyle.left - style.left;
                if(this.props.existAnimateStyle.right && showStyle.right) style.right = showStyle.right - style.right;
            }
            else
            {
                style = {...showStyle};
            }

            // 适配
            style = this.adaptation(style);
            // 缩放
            style = this.scale(style, 1 - this.props.existAnimateScale);

            $(this.domShow).finish().animate(style, this.props.existAnimateDuration, this.props.existAnimateName, this.existAnimatePositive)
        }
    }

    render()
    {
        let className = `component-Show`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }
        if(this.props.overflowIsVisible)
        {
            componentClassName += ` ${className}-visible`;
        }

        // 状态触发
        if(this.status != this.props.status)
        {
            // 记录状态
            this.status = this.props.status;

            switch (this.status)
            {
                // 等待
                case 'wait':
                    break;
                // 显示
                case 'show':
                    setTimeout(this.show, this.props.showOffsetTime < 10 ? 10 : this.props.showOffsetTime);
                    break;
                // 隐藏
                case 'hide':
                    setTimeout(this.hide, this.props.hideOffsetTime < 10 ? 10 : this.props.hideOffsetTime);
                    break;
            }
        }

        return(
            <div className={componentClassName} ref={dom => this.domShow = dom} style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
}

export default Show;