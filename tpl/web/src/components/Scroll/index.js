import React, {Component, PropTypes} from 'react';

import './style.scss';

class Scroll extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        // 是否滑动
        this.isMove = false;
        // 判定结果(0:未判定 1:滚动 2:终点)
        this.testResult = 0;
        // 滑动开始坐标记录
        this.startCoordinate = {x : 0, y : 0};
        // 滑动结束坐标记录
        this.endCoordinate = {x : 0, y : 0};
    }

    static propTypes =
    {
        // 获取ref
        getRef              :   React.PropTypes.func,
        // 是否判定
        isTest              :   React.PropTypes.bool,
        // 是否严格判断 (将以滑动轨迹正切值判定)
        isStrict            :   React.PropTypes.bool
    }

    static defaultProps =
    {
        // 获取ref
        getRef              :   dom => {},
        // 是否判定
        isTest              :   true,
        // 是否严格判定 (将以滑动轨迹正切值判定)
        isStrict            :   true
    }

    // 开始滑动
    startMove = e => {
        this.isMove = true;
        this.testResult = 0;
        this.startCoordinate = this.endCoordinate = {x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY};
    }

    // 结束滑动
    endMove = () => {
        this.isMove = false;
    }

    // 滑动
    move = e => {
        if(!this.props.isTest) return;
        e.stopPropagation();

        if(this.testResult == 0)
        {
            let isTest = true;
            this.testResult = 1;
            this.endCoordinate = {x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY};

            if(this.props.isStrict)
            {
                if(Math.pow(this.endCoordinate.y - this.startCoordinate.y, 2) + Math.pow(this.endCoordinate.x - this.startCoordinate.x, 2) >= 9)
                {
                    // 正切
                    const tan = (this.endCoordinate.y - this.startCoordinate.y) / (this.endCoordinate.x - this.startCoordinate.x);
                    isTest = tan >= 1 || tan <= -1;
                }
            }

            if(isTest)
            {
                // 往上滚动
                if(this.endCoordinate.y > this.startCoordinate.y && e.currentTarget.scrollTop <= 0)
                {
                    this.testResult = 2;
                }
                // 往下滚动
                else if(this.endCoordinate.y < this.startCoordinate.y && e.currentTarget.scrollHeight - e.currentTarget.clientHeight - e.currentTarget.scrollTop <= 0)
                {
                    this.testResult = 2;
                }
            }
        }

        if(this.testResult == 2)
        {
            e.preventDefault();
        }
    }

    render()
    {
        let className = `component-Scroll`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        return(
            <div
                className={componentClassName}
                ref={this.props.getRef}
                style={this.props.style}
                onMouseDown={this.startMove}
                onMouseUp={this.endMove}
                onMouseMove={e => {if(this.isMove) this.move(e)}}
                onTouchStart={this.startMove}
                onTouchEnd={this.endMove}
                onTouchMove={this.move}
                onWheel={e => {
                    e.stopPropagation();
                    if((e.deltaY < 0 && e.currentTarget.scrollTop <= 0) || (e.deltaY > 0 && e.currentTarget.scrollHeight - e.currentTarget.clientHeight - e.currentTarget.scrollTop <= 0))
                    {
                        e.preventDefault();
                    }
                }}
            >
                {this.props.children}
            </div>
        )
    }
}

export default Scroll;
