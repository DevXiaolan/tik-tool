import React, {Component, PropTypes} from 'react';
import Scroll from 'components/Scroll';
import $ from 'jquery';
import 'jquery-easing';

import './style.scss';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    static propTypes =
    {
        // 类型
        type            :   React.PropTypes.oneOf(['left', 'right']),
        // X
        x               :   React.PropTypes.number,
        // 背景色
        backgroundColor :   React.PropTypes.string,
        // 临时偏移-X
        deviationX      :   React.PropTypes.number,
        // 滑动延迟 (ms)
        offsetTime      :   React.PropTypes.number,
        // 滑动时间 (ms)
        duration        :   React.PropTypes.number,
        // 滑动动画名
        animateName     :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart',
            'easeOutQuart', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
            'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
        ]),
    }

    static defaultProps =
    {
        // 类型
        type            :   'left',
        // X
        x               :   0,
        // 背景色
        backgroundColor :   '#fff',
        // 偏移-X
        deviationX      :   0,
        // 滑动延迟 (ms)
        offsetTime      :   0,
        // 滑动时间 (ms)
        duration        :   500,
        // 滑动动画名
        animateName     :   'linear'
    }

    componentDidMount() {
        $(this.dom).css({width : this.props.x});
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.x != nextProps.x || (this.props.deviationX != nextProps.deviationX && nextProps.deviationX == 0))
        {
            setTimeout(() => {
                $(this.dom).finish().animate(
                    {
                        width : nextProps.x
                    }, nextProps.duration, nextProps.animateName
                )
            }, nextProps.offsetTime)
        }
        else if(this.props.deviationX != nextProps.deviationX)
        {
            $(this.dom).css({width : this.props.x + nextProps.deviationX * (this.props.type == 'left' ? 1 : -1)});
        }
    }

    render()
    {
        let className = `component-SidebarLayout-Sidebar`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        if(this.props.style)
        {
            delete this.props.style.width;
            delete this.props.style.position;
        }

        return (
            <Scroll
                className={componentClassName}
                getRef={dom => this.dom = dom}
                style={{...this.props.style, height : $(window).height() + 1, backgroundColor : this.props.backgroundColor, [this.props.type] : 0}}
            >
                <div className={`${className}-body`} style={{float : this.props.type == 'left' ? 'right' : 'left'}}>
                    {this.props.children}
                </div>
            </Scroll>
        );
    }
}

export default Sidebar;
