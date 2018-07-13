import React, {Component, PropTypes} from 'react';
import Modal from 'components/ModalAntd';
import ScrollPage from 'components/ScrollPage';
import browserAttr from 'utils/browserAttr';
import $ from 'jquery';

import './style.scss';

class ImageShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attr : []
        };
        this.url = this.getUrl(props.url);
        this.isUnmount = false;
        this.isClick = false;
    }

    static propTypes =
    {
        // 是否显示
        isShow              :   React.PropTypes.bool,
        // 当前页
        page                :   React.PropTypes.number,
        // 图片url    (多url用,隔开或数组)
        url                 :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]).isRequired,
        // 宽
        width               :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 高
        height              :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 上一页
        prev                :   React.PropTypes.func,
        // 下一页
        next                :   React.PropTypes.func,
        // 切换时间 (ms)
        changeDuration      :   React.PropTypes.number,
        // 切换动画名
        changeAnimateName   :   React.PropTypes.oneOf(['linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart',
            'easeOutQuart', 'easeOutQuint', 'easeInOutQuint', 'easeInExpo', 'easeOutSine', 'easeInOutSine', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
            'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
        ]),
        // 点击
        onClick             :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 是否显示
        isShow              :   false,
        // 当前页
        page                :   1,
        // 宽
        width               :   $(window).width(),
        // 高
        height              :   $(window).height(),
        // 上一页
        prev                :   () => {},
        // 下一页
        next                :   () => {},
        // 切换时间 (ms)
        changeDuration      :   300,
        // 切换动画名
        changeAnimateName   :   'easeOutCubic',
        // 点击
        onClick             :   () => {}
    }

    componentWillMount() {
        this.getAttr(this.url);
    }

    componentWillReceiveProps(props)
    {
        this.url = this.getUrl(props.url);
        this.getAttr(this.url);
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    getUrl = url => {
        if(Object.prototype.toString.call(url) == '[object String]')
        {
            url = url.split(',');
        }
        return url;
    }

    getAttr = url => {
        let attr = [];
        let finishedNum = 0;
        url.map((v, k) => {
            let image = new Image();
            image.onload = () => {
                const maxWidth = document.body.clientWidth;
                const maxHeight = document.body.clientHeight;
                let width = image.width / (browserAttr.versions.mobile ? 2 : 1);
                let height = image.height / (browserAttr.versions.mobile ? 2 : 1);
                if(width > maxWidth || height > maxHeight)
                {
                    if(width / maxWidth > height / maxHeight)
                    {
                        height = height / (width / maxWidth);
                        width = maxWidth;
                    }
                    else
                    {
                        width = width / (height / maxHeight);
                        height = maxHeight;
                    }
                }

                attr[v] = {width, height};
                finishedNum++;

                if(finishedNum == url.length)
                {
                    if(!this.isUnmount) this.setState({attr});
                }
            }
            image.src = v;
        });
    }

    render()
    {
        let className = `component-ImageShow`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let numbers = [];
        let showImages = [];
        this.url.map((v, k) => {
            showImages.push(
                <div key={k} className={`${className}-show-image-border`} style={{width : this.props.width}}>
                    <img className={`${className}-show-image`} src={v} width={this.state.attr[v] ? this.state.attr[v].width : 'auto'} height={this.state.attr[v] ? this.state.attr[v].height : 'auto'} />
                </div>
            );
            numbers.push(
                <div key={k} className={`${className}-number ${k + 1 == this.props.page ? `${className}-number-focus` : ''}`}></div>
            );
        });

        return(
            <Modal className={componentClassName} visible={this.props.isShow} style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
                <div
                    className={`${className}-show`}
                    onMouseDown={e => this.isClick = true}
                    onMouseUp={e => {
                        if(this.isClick)
                        {
                            this.props.onClick(e);
                        }
                    }}
                    onMouseMove={e => this.isClick = false}
                    onTouchStart={e => this.isClick = true}
                    onTouchEnd={e => {
                        if(this.isClick)
                        {
                            this.props.onClick(e);
                        }
                    }}
                    onTouchMove={e => this.isClick = false}
                >
                    {/*图片*/}
                    <ScrollPage
                        type={'X'}
                        pageWidth={this.props.width + 15}
                        pageHeight={this.props.height}
                        changeDuration={this.props.changeDuration}
                        changeAnimateName={this.props.changeAnimateName}
                        page={this.props.page}
                        pageSum={this.url.length}
                        prev={this.props.prev}
                        next={this.props.next}
                    >
                        {showImages}
                    </ScrollPage>
                    {/*编号*/}
                    <div className={`${className}-number-border`}>
                        {numbers}
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ImageShow;
