import React, {Component, PropTypes} from 'react';
import Grid from 'components/Grid';
import ImageShow from 'components/ImageShow';

import './style.scss';

class ImageGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否显示
            isShow          :   false,
            // 显示编号
            showIndex       :   1
        };
        this.url = this.getUrl(props.url);
    }

    static propTypes =
    {
        // 图片url    (多url用,隔开或数组)
        url                 :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]).isRequired,
        // 宽
        width               :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 高
        height              :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 单图片最大宽
        maxWidth            :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 单图片最大高
        maxHeight           :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        // 点击图片
        onClickImage        :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 宽
        width               :   100,
        // 高
        height              :   100,
        // 单图片最大宽
        maxWidth            :   '100%',
        // 单图片最大高
        maxHeight           :   250,
        // 点击图片
        onClickImage        :   () => {}
    }

    componentWillReceiveProps(props)
    {
        this.url = this.getUrl(props.url);
    }

    getUrl = url => {
        if(Object.prototype.toString.call(url) == '[object String]')
        {
            url = url.split(',');
        }
        return url;
    }

    render()
    {
        let className = `component-ImageGrid`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let images = null;
        if(this.url.length > 1)
        {
            let itemList = [];
            this.url.map((v, k) => {
                itemList.push(
                    <div
                        key={k}
                        className={`${className}-images`}
                        style={{width : this.props.width, height : this.props.height, backgroundImage : `url(${v})`}}
                        onClick={e => {
                            this.setState({isShow : true, showIndex : k + 1});
                            this.props.onClickImage(e);
                        }}
                    />
                );
            });
            images =
                <Grid
                    itemList={itemList}
                    width={this.props.width}
                    minMargin={10}
                />
        }
        else if(this.url[0] != '')
        {
            images =
                <div className={`${className}-image-border`}>
                    <img
                        className={`${className}-image`}
                        src={this.url[0]}
                        style={{maxWidth : this.props.maxWidth, maxHeight : this.props.maxHeight}}
                        onClick={e => {
                            this.setState({isShow : true});
                            this.props.onClickImage(e);
                        }}
                    />
                </div>
        }

        return(
            <div className={componentClassName} style={{...this.props.style}}>
                {images}
                <ImageShow
                    url={this.url}
                    isShow={this.state.isShow}
                    page={this.state.showIndex}
                    prev={page => this.setState({showIndex : page - 1})}
                    next={page => this.setState({showIndex : page + 1})}
                    onClick={() => this.setState({isShow : false})}
                />
            </div>
        )
    }
}

export default ImageGrid;
