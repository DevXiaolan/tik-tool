import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Icon from 'components/Icon';

import './style.scss';

class Avatar extends Component {
    static propTypes =
    {
        // 类名
        className           :   PropTypes.string,
        // 样式
        style               :   PropTypes.object,
        // 头像url (多头像用,隔开或数组)
        url                 :   PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        // ID (多ID用,隔开或数组)
        userId              :   PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        // 大小
        size                :   PropTypes.oneOf(['lg', 'md', 'sm', 'x-sm']),
        // 最大显示宽度
        maxWidth            :   PropTypes.number,
        // 是否查看钉钉个人资料(当userId不为空且在有钉钉对象时有效,此时将忽略link)
        isSeeDdProfile      :   PropTypes.bool,
        // 钉钉应用ID
        ddCorpId            :   PropTypes.string,
        // 钉钉对象
        dd                  :   PropTypes.object,
        // 链接 (完整链接为该链接+ID)
        link                :   PropTypes.string,
        // 是否拼接尺寸 (钉钉需要)
        isAddSize           :   PropTypes.bool
    }
    static defaultProps =
    {
        // 大小
        size                :   'md',
        // 是否查看钉钉个人资料(当userId不为空且在有钉钉对象时有效,此时将忽略link)
        isSeeDdProfile      :   true,
        // 钉钉对象
        dd                  :   null,
        // 链接 (完整链接为该链接+ID)
        link                :   '/user/home/',
        // 是否拼接尺寸 (钉钉需要)
        isAddSize           :   true
    }

    render()
    {
        let props = {...this.props};
        let className = 'component-Avatar';
        if(props.className)
        {
            className += ` ${props.className}`;
        }

        let avatarRender = null;
        let msg = null;
        let avatar = props.url;
        let userId = props.userId;
        const size = props.size;

        if(avatar)
        {
            if(!props.style)
            {
                props.style = {};
            }
            let avatarSize = '';
            let avatarWidth = 0;
            let msgMarginTop = 0;
            switch(size)
            {
                // 100*100
                case 'lg':
                    avatarSize = '_300x300.jpg';
                    avatarWidth = 100;
                    msgMarginTop = 41;
                    break;
                // 40*40
                case 'md':
                    avatarSize = '_120x120.jpg';
                    avatarWidth = 40;
                    msgMarginTop = 11;
                    break;
                // 20*20
                case 'sm':
                    avatarSize = '_60x60.jpg';
                    avatarWidth = 20;
                    msgMarginTop = 1;
                    break;
                // 17.5*17.5
                case 'x-sm':
                    avatarSize = '_60x60.jpg';
                    avatarWidth = 17.5;
                    msgMarginTop = 0;
                    break;
            }

            if(Object.prototype.toString.call(avatar) == '[object String]')
            {
                avatar = avatar.split(',');
            }

            if(Object.prototype.toString.call(userId) == '[object String]')
            {
                userId = userId.split(',');
            }

            let length = avatar.length;
            if(props.maxWidth)
            {
                const maxLength = Math.floor((props.maxWidth + 8) / (avatarWidth + 8));
                if(avatar.length > maxLength)
                {
                    length = maxLength - (size == 'sm' ? 2 : 1);
                    msg = <div className="msg" style={{marginTop : msgMarginTop}}>{`等${avatar.length}人`}</div>;
                }
            }

            avatarRender = [];
            avatar.map((v, k) => {
                if(k < length)
                {
                    let avatarDom = null;
                    if(v != '')
                    {
                        avatarDom = <span key={k} className={`avatar ${size}`} style={{backgroundImage : `url(${v + (this.props.isAddSize ? avatarSize : '')})`}}></span>;
                    }
                    else
                    {
                        avatarDom = <Icon key={k} className={`avatar-default ${size}`} type="user-circle-o" />;
                    }
                    if(userId && userId[k])
                    {
                        // 链接
                        if(!this.props.isSeeDdProfile || !this.props.dd || !this.props.ddCorpId)
                        {
                            avatarRender.push(<Link key={k} to={props.link + userId[k]}>{avatarDom}</Link>);
                        }
                        // 钉钉个人资料
                        else
                        {
                            avatarRender.push(
                                <span key={k} onClick={() => {
                                    this.props.dd.biz.util.open({
                                        name : 'profile',
                                        params : {
                                            id : userId[k],
                                            corpId : this.props.ddCorpId
                                        },
                                        onFail : err => {}
                                    });
                                }}>
                                    {avatarDom}
                                </span>
                            );
                        }
                    }
                    else
                    {
                        avatarRender.push(avatarDom);
                    }
                }
            });
        }
        // 默认头像
        else
        {
            avatarRender = <Icon className={`avatar-default ${size}`} type="user-circle" />;
        }

        return <div className={className} style={props.style}>{avatarRender}{msg}</div>;
    }
}

export default Avatar;
