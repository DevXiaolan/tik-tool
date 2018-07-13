import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import Avatar from 'components/Avatar';

import './style.scss';

class TextList extends Component {
    static propTypes =
    {
        // 显示内容
        content             : React.PropTypes.array,
        // 附加内容
        extraContent        : React.PropTypes.array,
        // 图标
        icon                : React.PropTypes.string,
        // 是否显示虚线
        isShowBottomLine    : React.PropTypes.bool,
        // 图标大小
        iconSize            : React.PropTypes.oneOf(['lg', 'md', 'sm', 'x-sm']),
        // 字体大小
        fontSize            : React.PropTypes.oneOf(['lg', 'md', 'sm', 'x-sm']),
    }

    static defaultProps =
    {
        // 图标
        icon                : 'circle-thin',
        // 显示内容
        content             : [],
        // 是否显示虚线
        isShowBottomLine    : false,
        // 附加内容
        extraContent        : [],
        // 图标大小
        iconSize            : 'md',
        // 字体大小
        fontSize            : 'md',
    }

    render()
    {
        let className = `component-Text-List`;
        let componentClassName = className;
        let list = [];
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        if(this.props.extraContent.length > 0){
            this.props.content.map((v, k) => {
                // 附件
                const extraFile = this.props.extraContent[k].files.length == '0' ? null :
                    <a href={this.props.extraContent[k].files[0]} className={`${className}-files`}>
                        <span className={`${className}-extraText`}>附件</span>
                        <Icon type={'paperclip'} className={`${className}-files-icon`}></Icon>
                    </a>
                //用户名
                const extraUser = this.props.extraContent[k].name ?
                <span className={`${className}-name`}>{this.props.extraContent[k].name}</span> : null;
                //用户头像
                const extraAvatar = this.props.extraContent[k].avatar ?
                <Avatar className={`${className}-avatar`} url={this.props.extraContent[k].avatar} size='x-sm'/> : null;
                //时间
                const extraTime = this.props.extraContent[k].update_time ?
                <div className={`${className}-time`}>{this.props.extraContent[k].update_time}</div> : null;
                // 图标
                const icon = this.props.content.length > 1 && this.props.icon ? <Icon type={this.props.icon} className={`${className}-icon ${className}-icon-${this.props.iconSize}`}/> : null;
                // 虚线
                const line = this.props.isShowBottomLine == true && k < this.props.content.length - 1 ? <div className={`${className}-line`}/> : null;
                if(this.props.content.length == 1){
                    list.push(
                        <div key={k} className={`${className}-content-${this.props.fontSize} ${className}-single`}>
                            {this.props.content}
                            <div className={`${className}-extra`}>
                                {extraTime}
                                {extraUser}
                                {extraAvatar}
                                {extraFile}
                            </div>
                            {line}
                        </div>
                        )
                }else{
                    list.push(
                        <div key={k} className={`${className}-list`}>
                            {icon}
                            <div className={`${className}-content ${className}-content-${this.props.fontSize}`}>
                                {v}
                            </div>
                            <div className={`${className}-extra`}>
                                {extraTime}
                                {extraUser}
                                {extraAvatar}
                                {extraFile}
                            </div>
                            {line}
                        </div>
                    )
                }

            })
        }else{
            this.props.content.map((v, k) => {
                // 图标
                const icon = this.props.content.length > 1 && this.props.icon ? <Icon type={this.props.icon} className={`${className}-icon ${className}-icon-${this.props.iconSize}`}/> : null;
                // 虚线
                const line = this.props.isShowBottomLine=='true' && k < this.props.content.length - 1 ? <div className={`${className}-line`}/> : null;
                if(this.props.content.length == 1){
                    list.push(
                        <div key={k} className={`${className}-single ${className}-content-${this.props.fontSize}`}>
                            {this.props.content}
                        </div>
                    )
                }else {
                    list.push(
                        <div key={k} className={`${className}-list`}>
                            {icon}
                            <div className={`${className}-content ${className}-content-${this.props.fontSize}`}>
                                {v}
                            </div>
                            {line}
                        </div>
                    )
                }
            })
        }

        return(
            <div className={componentClassName}>
                {list}
            </div>
        )
    }
}

export default TextList;
