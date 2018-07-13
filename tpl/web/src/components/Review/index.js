import React, {Component, PropTypes} from 'react';
import {Popover} from 'antd-mobile';
import {Spin} from 'antd';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import Text from 'components/Text';
import UserList from 'components/UserList';
import QueueAnim from 'rc-queue-anim';
import './style.scss';

class Review extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 操作显示
            isShowOperation     :   false,
        };
    }

    static propTypes =
    {
        // 内容
        content             :   React.PropTypes.string,
        // 评论人ID
        userId              :   React.PropTypes.string.isRequired,
        // 评论人头像
        userAvatar          :   React.PropTypes.string.isRequired,
        // 评论人名字
        userName            :   React.PropTypes.string.isRequired,
        // 时间
        time                :   React.PropTypes.string.isRequired,
        // 是否可转发
        isForward           :   React.PropTypes.bool,
        // 是否已转发
        isForwarded         :   React.PropTypes.bool,
        // 转发数
        forwardNum          :   React.PropTypes.number,
        // 转发
        openForward         :   React.PropTypes.func,
        // 取消转发
        closeForward        :   React.PropTypes.func,
        // 转发人列表  [User]
        forwardUsers        :   React.PropTypes.array,
        // 转发人最大显示人数
        forwardUsersLength  :   React.PropTypes.number,
        // 是否可点赞
        isLike              :   React.PropTypes.bool,
        // 是否已赞
        isLiked             :   React.PropTypes.bool,
        // 点赞数
        likeNum             :   React.PropTypes.number,
        // 点赞
        openLike            :   React.PropTypes.func,
        // 取消点赞
        closeLike           :   React.PropTypes.func,
        // 点赞人列表  [User]
        likeUsers           :   React.PropTypes.array,
        // 点赞人最大显示人数
        likeUsersLength     :   React.PropTypes.number,
        // 是否可回复
        isReply             :   React.PropTypes.bool,
        // 回复数
        replyNum            :   React.PropTypes.number,
        // 回复列表    [Reply]
        replies             :   React.PropTypes.array,
        // 回复
        reply               :   React.PropTypes.func,
        // 是否可取回复列表
        isGetReplies        :   React.PropTypes.bool,
        // 获取回复列表
        getReplies          :   React.PropTypes.func,
        // 是否正在获取回复列表
        isGettingReplies    :   React.PropTypes.bool,
        // 是否可删除
        isDelete            :   React.PropTypes.bool,
        // 删除
        delete              :   React.PropTypes.func,
        // 评论最大直接显示行数
        showLineNum         :   React.PropTypes.number
    }

    static defaultProps =
    {
        // 是否可转发
        isForward           :   false,
        // 是否已转发
        isForwarded         :   false,
        // 转发数
        forwardNum          :   0,
        // 转发
        openForward         :   () => {},
        // 取消转发
        closeForward        :   () => {},
        // 转发人列表  [User]
        forwardUsers        :   [],
        // 转发人最大显示人数
        forwardUsersLength  :   12,
        // 是否可点赞
        isLike              :   true,
        // 是否已赞
        isLiked             :   false,
        // 点赞数
        likeNum             :   0,
        // 点赞
        openLike            :   () => {},
        // 取消点赞
        closeLike           :   () => {},
        // 点赞人列表  [User]
        likeUsers           :   [],
        // 点赞人最大显示人数
        likeUsersLength     :   12,
        // 是否可回复
        isReply             :   true,
        // 回复数
        replyNum            :   0,
        // 回复列表    [Reply]
        replies             :   [],
        // 回复
        reply               :   () => {},
        // 是否可取回复列表
        isGetReplies        :   false,
        // 获取回复列表
        getReplies          :   null,
        // 是否正在获取回复列表
        isGettingReplies    :   false,
        // 是否可删除
        isDelete            :   false,
        // 删除
        delete              :   () => {},
        // 评论最大直接显示行数
        showLineNum         :   3
    }

    /**
     * 操作
     * @param opt
     */
    operation = opt => {
        switch (opt.key)
        {
            // 点赞
            case 'openLike':
                this.props.openLike();
                break;
            // 取消点赞
            case 'closeLike':
                this.props.closeLike();
                break;
            // 回复
            case 'reply':
                this.props.reply();
                break;
            // 转发
            case 'openForward':
                this.props.openForward();
                break;
            // 取消转发
            case 'closeForward':
                this.props.closeForward();
                break;
            // 删除
            case 'delete':
                this.props.delete();
                break;
        }
        this.setState({isShowOperation : false});
    }

    render()
    {
        let className = 'component-Review';
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let avatar = <Avatar url={this.props.userAvatar} size={'md'} userId={this.props.userId} />;

        // 操作
        let operation = null;
        if(this.props.isLike || this.props.isReply || this.props.isForward || this.props.isDelete)
        {
            let overlay = [];
            // 点赞
            if(this.props.isLike)
            {
                let key = null;
                let text = null;
                let icon = null;
                // 已点赞
                if(this.props.isLiked)
                {
                    key = 'closeLike';
                    text = <div className={`${className}-operation-text ${className}-operation-text-liked`}>点赞</div>;
                    icon = <Icon className={`${className}-operation-icon ${className}-operation-icon-liked`} type={'heart-o'} />;
                }
                else
                {
                    key = 'openLike';
                    text = <div className={`${className}-operation-text`}>点赞</div>;
                    icon = <Icon className={`${className}-operation-icon`} type={'heart-o'} />;
                }
                overlay.push(<Popover.Item key={key} className={`${className}-operation-item`} icon={icon}>{text}</Popover.Item>);
            }
            // 回复
            if(this.props.isReply)
            {
                overlay.push(<Popover.Item key="reply" className={`${className}-operation-item`} icon={<Icon className={`${className}-operation-icon ${className}-operation-icon-reply`} type={'pinglun2'} classType={'it'} />}>
                    <div className={`${className}-operation-text`}>回复</div>
                </Popover.Item>);
            }
            // 转发
            if(this.props.isForward)
            {
                let key = null;
                let text = null;
                let icon = null;
                // 已转发
                if(this.props.isForwarded)
                {
                    key = 'closeForward';
                    text = <div className={`${className}-operation-text ${className}-operation-text-forwarded`}>转发</div>;
                    icon = <Icon className={`${className}-operation-icon ${className}-operation-icon-forward ${className}-operation-icon-forwarded`} type={'skip'} classType={'it'} />;
                }
                else
                {
                    key = 'openForward';
                    text = <div className={`${className}-operation-text`}>转发</div>;
                    icon = <Icon className={`${className}-operation-icon ${className}-operation-icon-forward`} type={'skip'} classType={'it'} />;
                }
                overlay.push(<Popover.Item key={key} className={`${className}-operation-item`} icon={icon}>{text}</Popover.Item>);
            }
            // 删除
            if(this.props.isDelete)
            {
                overlay.push(<Popover.Item key="delete" className={`${className}-operation-item`} icon={<Icon className={`${className}-operation-icon ${className}-operation-icon-delete`} type={'remove'} />}>
                    <div className={`${className}-operation-text ${className}-operation-text-delete`}>删除</div>
                </Popover.Item>);
            }

            operation =
                <Popover
                    name={'test'}
                    visible={this.state.isShowOperation}
                    placement={'left'}
                    onSelect={this.operation}
                    overlay={overlay}
                >
                    <Icon className={`${className}-operation`} type={'ellipsis-h'} onClick={() => this.setState({isShowOperation : !this.state.isShowOperation})} />
                </Popover>
        }

        // 转发列表
        let forwardList =
            <UserList
                users={this.props.forwardUsers}
                length={this.props.forwardUsersLength}
                icon={<Icon className={`${className}-forward-icon${this.props.isForwarded ? ` ${className}-forward-icon-forwarded` : ''}`} type={'skip'} classType={'it'} />}
                size={'x-sm'}
            />

        // 赞列表
        let likeList =
            <UserList
                users={this.props.likeUsers}
                length={this.props.likeUsersLength}
                icon={<Icon className={`${className}-like-icon${this.props.isLiked ? ` ${className}-like-icon-liked` : ''}`} type={'heart-o'} />}
                size={'x-sm'}
            />

        // 回复列表
        let replyList = null;
        if(this.props.replies.length > 0)
        {
            let getReplies = null;
            if(this.props.isGetReplies)
            {
                getReplies =
                    <div className={`${className}-reply-get-border`}>
                        <Spin spinning={this.props.isGettingReplies}>
                            <div className={`${className}-reply-get`} onClick={this.props.getReplies}>
                                <Icon type={'ellipsis-h'} />
                            </div>
                        </Spin>
                    </div>
            }
            replyList =
                <div className={`${className}-reply`}>
                    <Icon className={`${className}-reply-icon`} type={'pinglun2'} classType={'it'} />
                    <div className={`${className}-reply-list`}>
                        <QueueAnim
                            type={'left'}
                            ease={'easeOutQuart'}
                        >
                            {this.props.replies}
                            {getReplies}
                        </QueueAnim>
                    </div>
                </div>
        }

        // SNS
        let sns = null;
        if(this.props.forwardUsers.length > 0 || this.props.likeUsers.length > 0 || this.props.replies.length > 0)
        {
            sns =
                <div className={`${className}-sns`}>
                    {forwardList}
                    {likeList}
                    {replyList}
                </div>
        }

        return(
            <div className={componentClassName}>
                <div className={`${className}-border`}>
                    <div className={`${className}-avatar`}>
                        {avatar}
                    </div>
                    <div className={`${className}-info`}>
                        <div className={`${className}-name`}>{this.props.userName}</div>
                        <div className={`${className}-time`}>{this.props.time}</div>
                    </div>
                    <div className={`${className}-operation`}>
                        {operation}
                    </div>
                </div>
                <div className={`${className}-content`}>
                    <Text
                        fontSize={14}
                        marginBottom={sns == null ? 0 : -3}
                        marginLeft={-20}
                        textClassName={`${className}-review`}
                        lineNum={this.props.showLineNum}
                        onClickText={e => {
                            // 回复
                            if(this.props.isReply)
                            {
                                this.props.reply();
                            }
                        }}
                    >
                        {this.props.children || this.props.content}
                    </Text>
                    {sns}
                </div>
            </div>
        )
    }
}

export default Review;
