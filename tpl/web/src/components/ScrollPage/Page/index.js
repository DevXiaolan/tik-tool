import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import 'jquery-easing';

import './style.scss';

class Page extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    static propTypes =
    {
        // 定位
        position        :   React.PropTypes.oneOf(['absolute', 'fixed']),
        // X
        x               :   React.PropTypes.number,
        // Y
        y               :   React.PropTypes.number,
        // 临时偏移-X
        deviationX      :   React.PropTypes.number,
        // 偏移-Y
        deviationY      :   React.PropTypes.number,
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
        // 定位
        position        :   'absolute',
        // X
        x               :   0,
        // Y
        y               :   0,
        // 偏移-X
        deviationX      :   0,
        // 临时偏移-Y
        deviationY      :   0,
        // 滑动延迟 (ms)
        offsetTime      :   0,
        // 滑动时间 (ms)
        duration        :   500,
        // 滑动动画名
        animateName     :   'linear'
    }

    componentDidMount() {
        $(this.dom).css({marginLeft : this.props.x, marginTop : this.props.y});
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.x != nextProps.x || this.props.y != nextProps.y || (this.props.deviationX != nextProps.deviationX && nextProps.deviationX == 0) || (this.props.deviationY != nextProps.deviationY && nextProps.deviationY == 0))
        {
            setTimeout(() => {
                $(this.dom).finish().animate(
                    {
                        marginLeft : nextProps.x,
                        marginTop : nextProps.y
                    }, nextProps.duration, nextProps.animateName
                )
            }, nextProps.offsetTime)
        }
        else if(this.props.deviationX != nextProps.deviationX || this.props.deviationY != nextProps.deviationY)
        {
            $(this.dom).css({marginLeft : this.props.x + nextProps.deviationX, marginTop : this.props.y + nextProps.deviationY});
        }
    }

    render()
    {
        let className = `component-ScrollPage-Page`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        delete this.props.style.marginLeft;
        delete this.props.style.marginTop;
        delete this.props.style.position;

        return (
            <div className={componentClassName} ref={dom => this.dom = dom} style={{...this.props.style, position : this.props.position}}>
                {this.props.children}
            </div>
        );
    }
}

export default Page;
