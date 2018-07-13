import React, {Component, PropTypes} from 'react';
import 'font-awesome/less/font-awesome.less';
import './style.scss';

class Icon extends Component {
    static propTypes =
    {
        // 分类 (fa:fontawesome图标 it:阿里iconfont图标)
        classType : React.PropTypes.oneOf(['fa', 'it']),
        // 类型   图标列表(可能版本不同步): http://www.fontawesome.com.cn/faicons
        type      : React.PropTypes.string.isRequired
    }

    render()
    {
        let className = null;
        if(this.props.classType == 'it')
        {
            className = `something_iconfont icon-${this.props.type}`;
            if(this.props.className)
            {
                className += ` ${this.props.className}`;
            }
        }
        // 默认fa
        else
        {
            className = `fa fa-${this.props.type}`;
            if(this.props.className)
            {
                className += ` ${this.props.className}`;
            }
        }

        let props = {...this.props};
        delete props.classType;

        return(
            <i {...{...props, className : className}} aria-hidden="true">{this.props.children}</i>
        )
    }
}

export default Icon;
