import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import 'jquery-easing';

import './style.scss';

class ScrollPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        // 是否滑动
        this.isMove = false;
        // 滑动方向
        this.moveDirection = null;
        // 滑动开始坐标记录
        this.startCoordinate = {x : 0, y : 0};
        // 滑动开始时间记录
        this.startTime = 0;
        // 滑动结束坐标记录
        this.endCoordinate = {x : 0, y : 0};
        // 滑动结束时间记录
        this.endTime = 0;
    }

    static propTypes =
    {
        // 类型 (X: 左右切换, Y: 上下切换)
        type                :   React.PropTypes.oneOf(['X', 'Y']),
        // 当前页
        page                :   React.PropTypes.number,
        // 总页数
        pageSum             :   React.PropTypes.number,
        // 每页宽度
        pageWidth           :   React.PropTypes.number,
        // 每页高度
        pageHeight          :   React.PropTypes.number,
        // 是否自切换
        isOwnChange         :   React.PropTypes.bool,
        // 是否单页切换
        isSinglePage        :   React.PropTypes.bool,
        // 是否从边缘滑入
        isEdge              :   React.PropTypes.bool,
        // 边缘有效值
        edgeValidNum        :   React.PropTypes.number,
        // 切换速度临界点
        changeSpeed         :   React.PropTypes.number,
        // 切换距离临界点
        changeDistance      :   React.PropTypes.number,
        // 切换最小距离
        changeMinDistance   :   React.PropTypes.number,
        // 上一页
        prev                :   React.PropTypes.func,
        // 下一页
        next                :   React.PropTypes.func,
        // 切换延迟 (ms)
        changeOffsetTime    :   React.PropTypes.number,
        // 切换时间 (ms)
        changeDuration      :   React.PropTypes.number,
        // 切换动画名
        changeAnimateName   :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart',
            'easeOutQuart', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
            'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
        ]),
        // 开始滑动
        onMoveStart         :   React.PropTypes.func,
        /**
         * 滑动时
         * @param moveX  滑动X
         * @param moveY  滑动Y
         * @param page  目的页数
         */
        onMoving            :   React.PropTypes.func,
        /**
         * 完成滑动
         * @param isChange  是否切换
         * @param page  目的页数
         * @param direction  方向
         */
        onMoveEnd           :   React.PropTypes.func,
        /**
         * 开始切换
         * @param page  页数
         * @param direction  方向
         */
        onChangeStart       :   React.PropTypes.func,
        /**
         * 完成切换
         * @param page  页数
         * @param direction  方向
         */
        onChangeEnd         :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 类型 (X: 左右切换, Y: 上下切换)
        type                :   'Y',
        // 当前页
        page                :   1,
        // 总页数
        pageSum             :   1,
        // 每页宽度
        pageWidth           :   $(window).width(),
        // 每页高度
        pageHeight          :   $(window).height(),
        // 是否自切换
        isOwnChange         :   true,
        // 是否单页切换
        isSinglePage        :   false,
        // 是否从边缘滑入
        isEdge              :   false,
        // 边缘有效值
        edgeValidNum        :   15,
        // 切换速度临界点
        changeSpeed         :   0.07,
        // 切换距离临界点
        changeDistance      :   100,
        // 切换最小距离
        changeMinDistance   :   15,
        // 上一页
        prev                :   () => {},
        // 下一页
        next                :   () => {},
        // 切换延迟 (ms)
        changeOffsetTime    :   0,
        // 切换时间 (ms)
        changeDuration      :   500,
        // 切换动画名
        changeAnimateName   :   'easeOutQuad',
        // 开始滑动
        onMoveStart         :   () => {},
        /**
         * 滑动时
         * @param moveX  滑动X
         * @param moveY  滑动Y
         * @param page  目的页数
         */
        onMoving            :   (moveX, moveY, page) => {},
        /**
         * 完成滑动
         * @param isChange  是否切换
         * @param page  目的页数
         * @param direction  方向
         */
        onMoveEnd           :   (isChange, page, direction) => {},
        /**
         * 开始切换
         * @param page  页数
         * @param direction  方向
         */
        onChangeStart       :   (page, direction) => {},
        /**
         * 完成切换
         * @param page  页数
         * @param direction  方向
         */
        onChangeEnd         :   (page, direction) => {}
    }

    componentDidMount() {
        $(this.bodyDom).css('position', $(this.dom).css('position'));
        this.changePage(this.props.page, null, true);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.page != this.props.page)
        {
            this.changePage(nextProps.page, nextProps.page > this.props.page ? 'next' : 'prev');
        }
    }

    // 切换
    changePage = (page, direction, isInit=false) => {
        let style = {};
        if((this.props.isOwnChange || isInit) && !this.props.isSinglePage)
        {
            if(this.props.type == 'X')
            {
                style.marginLeft = this.props.pageWidth * (page - 1) * -1;
            }
            else
            {
                style.marginTop = this.props.pageHeight * (page - 1) * -1;
            }
        }

        if(isInit)
        {
            this.props.onChangeStart(page, direction);
            $(this.bodyDom).css(style);
            this.props.onChangeEnd(page, direction);
        }
        else
        {
            setTimeout(() => {
                this.props.onChangeStart(page, direction);
                $(this.bodyDom).animate(style, this.props.changeDuration, this.props.changeAnimateName, () => this.props.onChangeEnd(page, direction));
            }, this.props.changeOffsetTime);
        }
    }

    // 开始滑动
    startMove = e => {
        this.startCoordinate = this.endCoordinate = {x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY};
        // 边缘滑入
        if(this.props.isEdge && !((this.props.type == 'X' && (this.startCoordinate.x <= this.props.edgeValidNum || this.startCoordinate.x >= this.props.pageWidth - this.props.edgeValidNum)) || (this.props.type == 'Y' && (this.startCoordinate.y <= this.props.edgeValidNum || this.startCoordinate.y >= this.props.pageHeight - this.props.edgeValidNum))))
        {
            this.isMove = false;
            return;
        }

        this.isMove = true;
        this.moveDirection = null;
        this.props.onMoveStart();
        //禁用拖动
        document.body.onselectstart = document.body.oncontextmenu = document.ondragstart = () => false;
        this.startTime = new Date().getTime();
    }

    // 结束滑动
    endMove = () => {
        this.isMove = false;
        //释放拖动
        document.body.onselectstart = document.body.oncontextmenu = document.ondragstart = () => true;
        this.endTime = new Date().getTime();

        // 点击
        if(Math.pow(this.endCoordinate.y - this.startCoordinate.y, 2) + Math.pow(this.endCoordinate.x - this.startCoordinate.x, 2) <= 4)
        {
            return;
        }

        // 方向错误
        if(this.props.type != this.moveDirection)
        {
            return;
        }

        // 是否切换
        let isChange = false;
        // 切换目的页数
        let page = 0;
        // 方向
        let direction = null;

        // 正切
        const tan = (this.endCoordinate.y - this.startCoordinate.y) / (this.endCoordinate.x - this.startCoordinate.x);
        // 上下
        if((tan >= 1 || tan <= -1) && this.props.type == 'Y')
        {
            // Y距离
            const distance = Math.abs(this.endCoordinate.y - this.startCoordinate.y);
            // Y速度
            const speed = distance / (this.endTime - this.startTime);
            if(distance >= this.props.changeMinDistance && (speed >= this.props.changeSpeed || this.props.changeDistance <= distance))
            {
                if(this.endCoordinate.y <= this.startCoordinate.y)
                {
                    // 下一页
                    if(this.props.page < this.props.pageSum)
                    {
                        isChange = true;
                        page = this.props.page + 1;
                        direction = 'Y';
                        this.props.next(this.props.page);
                    }
                }
                else
                {
                    // 上一页
                    if(this.props.page > 1)
                    {
                        isChange = true;
                        page = this.props.page - 1;
                        direction = 'Y';
                        this.props.prev(this.props.page);
                    }
                }
            }
        }
        // 左右
        else if((this.endCoordinate.x == this.startCoordinate.x || tan < 1 && tan > -1) && this.props.type == 'X')
        {
            // X距离
            const distance = Math.abs(this.endCoordinate.x - this.startCoordinate.x);
            // X速度
            const speed = distance / (this.endTime - this.startTime);

            if(distance >= this.props.changeMinDistance && (speed >= this.props.changeSpeed || this.props.changeDistance <= distance))
            {
                if(this.endCoordinate.x <= this.startCoordinate.x)
                {
                    // 下一页
                    if(this.props.page < this.props.pageSum)
                    {
                        isChange = true;
                        page = this.props.page + 1;
                        direction = 'X';
                        this.props.next(this.props.page);
                    }
                }
                else
                {
                    // 上一页
                    if(this.props.page > 1)
                    {
                        isChange = true;
                        page = this.props.page - 1;
                        direction = 'X';
                        this.props.prev(this.props.page);
                    }
                }
            }
        }

        // 恢复预览
        if(!isChange && this.props.isOwnChange && !this.props.isSinglePage)
        {
            let style = {};
            if(this.props.type == 'X')
            {
                style.marginLeft = this.props.pageWidth * (this.props.page - 1) * -1;
            }
            else
            {
                style.marginTop = this.props.pageHeight * (this.props.page - 1) * -1;
            }
            $(this.bodyDom).finish().animate(style, this.props.changeDuration, this.props.changeAnimateName);
        }

        // 完成滑动
        this.props.onMoveEnd(isChange, page, direction);
    }

    // 滑动
    move = e => {
        this.endCoordinate = {x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY};

        // 计算滑动方向
        if(!this.moveDirection && Math.pow(this.endCoordinate.y - this.startCoordinate.y, 2) + Math.pow(this.endCoordinate.x - this.startCoordinate.x, 2) >= 9)
        {
            // 正切
            const tan = (this.endCoordinate.y - this.startCoordinate.y) / (this.endCoordinate.x - this.startCoordinate.x);
            this.moveDirection = tan >= 1 || tan <= -1 ? 'Y' : 'X';
        }

        // 方向错误
        if(this.props.type != this.moveDirection)
        {
            return;
        }

        // 禁用默认
        e.preventDefault();

        // 滑动时
        let x = this.endCoordinate.x - this.startCoordinate.x;
        let y = this.endCoordinate.y - this.startCoordinate.y;
        let page = this.props.page;

        if(this.props.type == 'X')
        {
            if(this.props.page == 1 && x > 0)
            {
                x = 0;
            }
            else if(this.props.page == this.props.pageSum && x < 0)
            {
                x = 0;
            }
            else if(x > 0)
            {
                page--;
            }
            else if(x < 0)
            {
                page++;
            }
            y = 0;
        }
        else
        {
            if(this.props.page == 1 && y > 0)
            {
                y = 0;
            }
            else if(this.props.page == this.props.pageSum && y < 0)
            {
                y = 0;
            }
            else if(y > 0)
            {
                page--;
            }
            else if(y < 0)
            {
                page++;
            }
            x = 0;
        }

        // 预览
        if(this.props.isOwnChange && !this.props.isSinglePage)
        {
            let style = {};
            if(this.props.type == 'X')
            {
                style.marginLeft = this.props.pageWidth * (this.props.page - 1) * -1 + x;
            }
            else
            {
                style.marginTop = this.props.pageHeight * (this.props.page - 1) * -1 + y;
            }
            $(this.bodyDom).css(style);
        }

        this.props.onMoving(x, y, page);
    }

    render()
    {
        let className = `component-ScrollPage`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        return (
            <div
                className={componentClassName}
                ref={dom => this.dom = dom}
                style={{...this.props.style, width : this.props.pageWidth, height : this.props.pageHeight}}
                onMouseDown={this.startMove}
                onMouseUp={this.endMove}
                onMouseMove={e => {if(this.isMove) this.move(e)}}
                onTouchStart={this.startMove}
                onTouchEnd={this.endMove}
                onTouchMove={e => {if(this.isMove) this.move(e)}}
            >
                <div
                    ref={dom => this.bodyDom = dom}
                    className={`${className}-body`}
                    style={{width : this.props.pageWidth * (!this.props.isSinglePage && this.props.type == 'X' ? this.props.pageSum : 1), height : this.props.pageHeight * (!this.props.isSinglePage && this.props.type == 'Y' ? this.props.pageSum : 1)}}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ScrollPage;
