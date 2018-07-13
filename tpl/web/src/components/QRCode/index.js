import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import 'jquery-qrcode';
import './style.scss';

class QRCode extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    static propTypes =
    {
        // 二维码宽度
        width           :   React.PropTypes.number,
        // 二维码高度
        height          :   React.PropTypes.number,
        // 二维码信息
        text            :   React.PropTypes.string,
        // 渲染方式
        render          :   React.PropTypes.oneOf(['canvas', 'table'])
    }
    static defaultProps =
    {
        // 二维码宽度
        width           :   230,
        // 二维码高度
        height          :   230,
        // 二维码信息
        text            :   'null',
        // 渲染方式
        render          :   'canvas'
    }
    componentDidMount() {
        $(this.dom).qrcode({
            render      :   this.props.render, //table方式
            width       :   this.props.width, //宽度
            height      :   this.props.height, //高度
            text        :   this.toUtf8(this.props.text) //任意内容
        });
    }
    /**
     * 解决中文乱码问题：
     * jquery-qrcode采用的是charCodeAt编码转换，此方法是获取默认的Unicode编码
     * 如果有中文，需要将其转化为UTF-8编码
     */
    toUtf8 = (str) => {
        var out, i, len, c;
        out = "";
        len = str.length;
        for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    }


    render()
    {
        let className = 'component-QRCode';
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        return(
            <div className={className} ref={dom => this.dom = dom}>
            </div>
        )
    }
}


export default QRCode;
