import React, {Component, PropTypes} from 'react';
import {Spin} from 'antd';
import getSrc from 'utils/imgSrc';
import $ from 'jquery';

import './style.scss';

class ImageLoading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否加载完成
            isFinish    :   false
        };
    }

    static propTypes =
    {
        // 加载图片
        images          :   React.PropTypes.array.isRequired,
        // loading宽
        width           :   React.PropTypes.number,
        // loading高
        height          :   React.PropTypes.number
    }

    static defaultProps =
    {
        // loading宽
        width           :   $(window).width(),
        // loading高
        height          :   $(window).height()
    }

    componentWillMount() {
        // 加载
        if(this.props.images.length > 0)
        {
            let finished = [];
            this.props.images.map((v, k) => {
                let image = new Image();
                image.onload = () => {
                    finished.push(k);
                    // 检查是否全部加载完成
                    if(finished.length == this.props.images.length)
                    {
                        this.setState({isFinish : true});
                    }
                }
                image.src = getSrc(v);
            });
        }
        else
        {
            this.setState({isFinish : true});
        }
    }

    render()
    {
        let className = `component-ImageLoading`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let component = null;
        if(this.state.isFinish)
        {
            component = this.props.children;
        }
        else
        {
            component =
                <Spin
                    className={componentClassName}
                    spinning={true}
                    style={{width : this.props.width, height : this.props.height}}
                >
                    <div></div>
                </Spin>
        }

        return component;
    }
}

export default ImageLoading;
