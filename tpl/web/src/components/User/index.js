import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import Avatar from 'components/Avatar'

import './style.scss'

class User extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    static propTypes =
    {
        // 头像url
        userAvatar          :   PropTypes.string,
        // ID
        userId              :   PropTypes.string,
        // 名字
        userName            :   PropTypes.string,
        // 大小
        size                :   PropTypes.oneOf(['sm', 'x-sm']),
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
        size                :   'sm',
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
        let className = 'component-User'
        let componentClassName = `${className} ${className}-${this.props.size}`
        if(this.props.className) {
            componentClassName += ` ${this.props.className}`
        }

        let userName = this.props.userName || this.props.children
        if(this.props.userId) {
            if(!this.props.isSeeDdProfile || !this.props.dd || !this.props.ddCorpId) {
                userName =
                    <Link className={`${className}-link`} to={this.props.link + this.props.userId}>{userName}</Link>
            }
            else {
                userName =
                    <span
                        onClick={() => {
                            this.props.dd.biz.util.open({
                                name : 'profile',
                                params : {
                                    id : this.props.userId,
                                    corpId : this.props.ddCorpId
                                },
                                onFail : err => {}
                            })
                        }}
                    >
                        {userName}
                    </span>
            }
        }

        return(
            <span className={componentClassName}>
                <Avatar
                    className={`${className}-avatar`}
                    url={this.props.userAvatar}
                    userId={this.props.userId}
                    size={this.props.size}
                    isSeeDdProfile={this.props.isSeeDdProfile}
                    dd={this.props.dd}
                    ddCorpId={this.props.ddCorpId}
                    link={this.props.link}
                />
                {userName}
            </span>
        )
    }
}

export default User
