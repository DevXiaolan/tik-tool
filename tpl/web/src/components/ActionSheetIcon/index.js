import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import dd from 'utils/dingding';
import CONFIG from 'config/app';
import './style.scss';

class ActionSheetIcon extends Component {
    static propTypes =
    {
        // 类型
        type        : React.PropTypes.oneOf(['chat', 'chat_mobile', 'mobile']).isRequired,
        // 钉钉员工工号   (type为chat, chat_mobile时须设置)
        userId      : React.PropTypes.string,
        // 电话号码     (type为mobile时须设置)
        mobile      : React.PropTypes.string
    }

    render()
    {
        let className = `component-ActionSheetIcon`;
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        let action = null;
        let icon = null;

        switch(this.props.type)
        {
            // 钉钉
            case 'chat':
                action = () => {
                    dd.biz.chat.openSingleChat({
                        corpId : CONFIG.DD_CORP_ID,
                        userId : this.props.userId,
                        onSuccess : () => {},
                        onFail : error => {console.log(error)}
                    });
                }
                icon = <Icon className={`component-ActionSheetIcon-icon ${this.props.type}`} classType="it" type="dingding" />;
                break;
            // 钉钉电话
            case 'chat_mobile':
                action = () => {
                    dd.biz.telephone.call({
                        corpId : CONFIG.DD_CORP_ID,
                        users : [this.props.userId],
                        onSuccess : () => {},
                        onFail : error => {console.log(error)}
                    });
                }
                icon = <Icon className={`component-ActionSheetIcon-icon ${this.props.type}`} type="phone" />;
                break;
            // 手机电话
            case 'mobile':
                action = () => {
                    dd.biz.telephone.showCallMenu({
                        phoneNumber: this.props.mobile,
                        code: '+86',
                        showDingCall: true,
                        onSuccess : () => {},
                        onFail : error => {console.log(error)}
                    })
                }
                icon = <Icon className={`component-ActionSheetIcon-icon ${this.props.type}`} type="phone" />;
                break;
        }

        return(
            <div className={className} style={this.props.style} onClick={action}>
                {icon}
            </div>
        )
    }
}

export default ActionSheetIcon;
