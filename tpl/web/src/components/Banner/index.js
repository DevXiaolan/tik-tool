import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import BannerAnim, {Element} from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import $ from 'jquery';
import 'rc-banner-anim/assets/index.css';
import './style.scss';

class Banner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 高
            height      : 0
        };
    }

    static propTypes =
    {
        // 内容  [{imgUrl, link, title, text}]
        contentList     :   React.PropTypes.array.isRequired,
        // 是否自动播放
        isAutoPlay      :   React.PropTypes.bool
    }

    static defaultProps =
    {
        // 是否自动播放
        isAutoPlay      :   true
    }

    componentDidMount() {
        let img = new Image();
        img.onload = () => {
            this.setState({height : Math.floor(img.height / (img.width / $(this.bannerBorder).width()))});
        }
        img.src = this.props.contentList[0].imgUrl;
    }

    // 链接
    link = link => {
        if(link)
        {
            browserHistory.push(link);
        }
    }

    render()
    {
        let className = `component-Banner`;
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        let banner = null;
        if(this.state.height != 0)
        {
            const BgElement = Element.BgElement;
            let BgElementList = [];
            this.props.contentList.map((v, k)=>{
                BgElementList.push(
                    <Element
                        key={k}
                        onClick={() => this.link(v.link)}
                    >
                        <BgElement key={`${className}-bg`} className={`${className}-bg`} style={{opacity : !v.title && !v.text ? 1 : 0.6}}>
                            <img className={`${className}-img`} src={v.imgUrl} />
                        </BgElement>
                        <TweenOne className={`${className}-title`} animation={{y: 30, opacity: 0, type: 'from'}}>
                            {v.title}
                        </TweenOne>
                        <TweenOne className={`${className}-text`} animation={{y: 30, opacity: 0, type: 'from', delay: 100}}>
                            {v.text}
                        </TweenOne>
                    </Element>
                );
            });

            banner =
                <BannerAnim ref={dom => this.banner = dom} style={{height : this.state.height}} prefixCls={`${className}-banner`} autoPlay={this.props.isAutoPlay} autoPlaySpeed={10000} arrow={false}>
                    {BgElementList}
                </BannerAnim>
        }

        return (
            <div className={className} ref={dom => this.bannerBorder = dom} style={{height : this.state.height}}>
                {banner}
            </div>
        );
    }
}

export default Banner;
