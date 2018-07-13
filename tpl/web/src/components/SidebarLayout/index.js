import React, {Component} from 'react';
import ScrollPage from 'components/ScrollPage';
import Sidebar from './Sidebar';
import $ from 'jquery';

import './style.scss';

class SidebarLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 页数
            page                    :   2,
            // left X
            leftX                   :   0,
            // left 偏移X
            leftDeviationX          :   0,
            // middle X
            middleX                 :   0,
            // middle border display
            middleBorderDisplay     :   'none',
            // middle border opacity
            middleBorderOpacity     :   0,
            // right X
            rightX                  :   0,
            // right 偏移X
            rightDeviationX         :   0
        };
    }

    static propTypes =
    {
        // 页数 (用于主动控制页数,应于setPage同步)
        page                        :   React.PropTypes.oneOf([1, 2, 3]),
        // 设置页数
        setPage                     :   React.PropTypes.func,
        // 左内容
        leftBody                    :   React.PropTypes.element,
        // 左宽度
        leftWidth                   :   React.PropTypes.number,
        // 左背景色
        leftBackgroundColor         :   React.PropTypes.string,
        // 左滑动时间
        leftDuration                :   React.PropTypes.number,
        // 左滑动动画
        leftAnimateName             :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart',
            'easeOutQuart', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
            'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
        ]),
        // 中内容
        middleBody                  :   React.PropTypes.element,
        // 右内容
        rightBody                   :   React.PropTypes.element,
        // 右宽度
        rightWidth                  :   React.PropTypes.number,
        // 右背景色
        rightBackgroundColor        :   React.PropTypes.string,
        // 右滑动时间
        rightDuration               :   React.PropTypes.number,
        // 右滑动动画
        rightAnimateName            :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart',
            'easeOutQuart', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
            'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
        ]),
        // 切换速度临界点
        changeSpeed                 :   React.PropTypes.number,
        // 切换距离临界点
        changeDistance              :   React.PropTypes.number,
        /**
         * 事件:当界面改变时
         * @param page  当前页数
         * @param prevPage  改变前页数
         */
        onChangePage                :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 页数 (用于主动控制页数,应于setPage同步)
        page                        :   null,
        // 设置页数
        setPage                     :   page => {},
        // 左内容
        leftBody                    :   null,
        // 左宽度
        leftWidth                   :   $(window).width() - 100 > 500 ? 500 : $(window).width() - 100,
        // 左背景色
        leftBackgroundColor         :   '#fff',
        // 左滑动时间
        leftDuration                :   200,
        // 左滑动动画
        leftAnimateName             :   'easeOutQuad',
        // 中内容
        middleBody                  :   null,
        // 右内容
        rightBody                   :   null,
        // 右宽度
        rightWidth                  :   $(window).width() - 100 > 500 ? 500 : $(window).width() - 100,
        // 右背景色
        rightBackgroundColor        :   '#fff',
        // 右滑动时间
        rightDuration               :   200,
        // 右滑动动画
        rightAnimateName            :   'easeOutQuad',
        // 切换速度临界点
        changeSpeed                 :   0.7,
        // 切换距离临界点
        changeDistance              :   100,
        /**
         * 事件:当界面改变时
         * @param page  当前页数
         * @param prevPage  改变前页数
         */
        onChangePage                :   (page, prevPage) => {}
    }

    componentWillMount() {
        // 设置页数
        this.props.setPage(this.props.page || this.state.page);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.page != null && nextProps.page != this.state.page)
        {
            this.changePage(nextProps.page);
        }
    }

    /**
     * 改变页
     * page     页数
     */
    changePage = page => {
        let newState = {};

        switch(page)
        {
            case 1:
                if(this.props.leftBody != null)
                {
                    newState.page = page;
                    newState.leftX = this.props.leftWidth;
                    newState.middleBorderDisplay = 'block';
                    newState.middleBorderOpacity = 1;
                }
                else
                {
                    return;
                }
                newState.rightX = 0;
                newState.leftDeviationX = 0;
                newState.rightDeviationX = 0;
                break;
            case 2:
                newState.page = page;
                newState.leftX = 0;
                newState.rightX = 0;
                newState.middleBorderOpacity = 0;
                newState.leftDeviationX = 0;
                newState.rightDeviationX = 0;
                setTimeout(() => {this.setState({middleBorderDisplay : 'none'})}, 200);
                break;
            case 3:
                if(this.props.rightBody != null)
                {
                    newState.page = page;
                    newState.rightX = this.props.rightWidth;
                    newState.middleBorderDisplay = 'block';
                    newState.middleBorderOpacity = 1;
                }
                else
                {
                    return;
                }
                newState.leftX = 0;
                newState.leftDeviationX = 0;
                newState.rightDeviationX = 0;
                break;
        }

        // 设置页数
        const prevPage = this.state.page;
        this.setState(newState);
        setTimeout(() => {
            this.props.setPage(page);
            this.props.onChangePage(page, prevPage);
        }, 20);
    }

    render() {
        let className = 'component-SidebarLayout';
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        return(
            <ScrollPage
                className={componentClassName}
                type={'X'}
                isOwnChange={false}
                isSinglePage={true}
                isEdge={true}
                changeSpeed={this.props.changeSpeed}
                changeDistance={this.props.changeDistance}
                page={this.state.page}
                pageSum={3}
                onMoving={(x, y, page) => {
                    {/*console.log(`${x} ${y} ${page}`);*/}
                    if(x != 0)
                    {
                        let newState = {};
                        const opacity = (Math.abs(x) > this.props.changeDistance ? this.props.changeDistance : Math.abs(x)) / this.props.changeDistance;

                        switch(page)
                        {
                            case 1:
                                if(this.props.leftBody != null)
                                {
                                    newState.leftDeviationX = x > this.props.leftWidth ? this.props.leftWidth : x;
                                    newState.middleBorderDisplay = 'block';
                                    newState.middleBorderOpacity = opacity;
                                }
                                newState.rightDeviationX = 0;
                                break;
                            case 2:
                                if(x < 0)
                                {
                                    if(this.props.leftBody != null)
                                    {
                                        newState.leftDeviationX = x;
                                        newState.middleBorderDisplay = 'block';
                                        newState.middleBorderOpacity = 1 - opacity;
                                    }
                                    newState.rightDeviationX = 0;
                                }
                                else
                                {
                                    if(this.props.rightBody != null)
                                    {
                                        newState.rightDeviationX = x;
                                        newState.middleBorderDisplay = 'block';
                                        newState.middleBorderOpacity = 1 - opacity;
                                    }
                                    newState.leftDeviationX = 0;
                                }
                                break;
                            case 3:
                                if(this.props.rightBody != null)
                                {
                                    newState.rightDeviationX = x * -1 > this.props.rightWidth ? this.props.rightWidth * -1 : x;
                                    newState.middleBorderDisplay = 'block';
                                    newState.middleBorderOpacity = opacity;
                                }
                                newState.leftDeviationX = 0;
                                break;
                        }

                        this.setState(newState);
                    }
                }}
                onMoveEnd={(isChange, page, direction) => {
                    {/*console.log(`${isChange} ${page}`);*/}
                    if(isChange)
                    {
                        this.changePage(page);
                    }
                    else
                    {
                        this.setState({leftDeviationX : 0, rightDeviationX : 0, middleBorderOpacity : this.state.page == 2 ? 0 : 1});
                        if(this.state.page == 2) setTimeout(() => {this.setState({middleBorderDisplay : 'none'})}, 200);
                    }
                }}
            >
                {/*left*/}
                <Sidebar
                    className={`${className}-left`}
                    type={'left'}
                    x={this.state.leftX}
                    backgroundColor={this.props.leftBackgroundColor}
                    deviationX={this.state.leftDeviationX}
                    duration={this.props.leftDuration}
                    animateName={this.props.leftAnimateName}
                >
                    {/*left body*/}
                    {this.props.leftBody}
                </Sidebar>

                {/*right*/}
                <Sidebar
                    className={`${className}-right`}
                    type={'right'}
                    x={this.state.rightX}
                    backgroundColor={this.props.rightBackgroundColor}
                    deviationX={this.state.rightDeviationX}
                    duration={this.props.rightDuration}
                    animateName={this.props.rightAnimateName}
                >
                    {/*right body*/}
                    {this.props.rightBody}
                </Sidebar>

                {/*middle*/}
                <div
                    className={`${className}-middle`}
                    style={{width : $(window).width()}}
                >
                    {/*middle border*/}
                    <div
                        className={`${className}-middle-border`}
                        style={{width : $(window).width(), height : $(window).height(), display : this.state.middleBorderDisplay, backgroundColor : `rgba(0, 0, 0, ${this.state.middleBorderOpacity * 0.4})`}}
                        onClick={() => this.changePage(2)}
                    />
                    {/*middle body*/}
                    {this.props.middleBody}
                </div>
            </ScrollPage>
        )
    }
}

export default SidebarLayout;