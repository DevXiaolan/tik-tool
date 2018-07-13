import React, {Component, PropTypes} from 'react';
import {Row, Col, Tag} from 'antd';
import {List, Modal as ModalAntd, Toast} from 'antd-mobile';
import Modal from 'components/Modal';
import ModularContainer from 'components/ModularContainer';
import Button from 'components/Button';
import ToastContent from 'components/ToastContent';

import $ from 'jquery';

import './style.scss';

class TagItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否选择
            isSelect    : false,
            // 临时已选标签
            value       : this.getValue(props.value)
        };
        // 已选标签
        this.value = this.getValue(props.value);
        // 新增标签
        this.newTags = [];
        // 所有标签
        this.allTags = props.hotTags.concat(props.commonTags);
    }

    static propTypes =
    {
        // 标签名
        labelName           :   React.PropTypes.string.isRequired,
        // 初始已选标签    [id, id] || id,id
        value               :   React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        // 选择改变时
        onChange            :   React.PropTypes.func,
        // 热门    [{id, name}]
        hotTags             :   React.PropTypes.array,
        // 一般    [{id, name}]
        commonTags          :   React.PropTypes.array,
        // 最大选择 (-1: 不限)
        maxNum              :   React.PropTypes.number,
        // 最大长度
        maxLength           :   React.PropTypes.number,
        // 是否可编辑
        editable            :   React.PropTypes.bool,
        // 确定按钮类型
        submitButtonType    :   React.PropTypes.string
    }

    static defaultProps =
    {
        // 热门    [{id, name}]
        hotTags             :   [],
        // 一般    [{id, name}]
        commonTags          :   [],
        // 最大选择 (-1: 不限)
        maxNum              :   -1,
        // 最大长度
        maxLength           :   10,
        // 是否可编辑
        editable            :   true,
        // 确定按钮类型
        submitButtonType    :   'normal'
    }

    componentWillReceiveProps(nextProps) {
        this.allTags = nextProps.hotTags.concat(nextProps.commonTags, this.newTags);
    }

    // 打开选择
    select = () => {
        if(this.props.editable)
        {
            this.setState({isSelect : true});
        }
    }

    // 确定选择
    submit = () => {
        this.value = this.state.value.concat();
        if(this.props.onChange)
        {
            this.props.onChange(this.value.join(','));
        }
        this.setState({isSelect : false});
    }

    // 取消选择
    cancel = () => {
        this.setState({isSelect : false, value : this.value.concat()});
    }

    // 新增标签
    add = () => {
        if(!this.isAdd())
        {
            return;
        }

        ModalAntd.prompt(`新增${this.props.labelName}`, '没有合适的？新增一个吧',
            [
                {text : '取消'},
                {
                    text : '确定',
                    onPress : value => {
                        value = $.trim(value);
                        if(!value)
                        {
                            return;
                        }
                        if(value.length > this.props.maxLength)
                        {
                            Toast.info(<ToastContent type="fail" content={`${this.props.labelName}应不大于 ${this.props.maxLength} 个长度`} />, 3, null, false);
                            return;
                        }

                        let isNew = true;
                        let isAdd = true;
                        let newId = `new_${value}`;
                        const id = this.getId(this.allTags, value);
                        if(id)
                        {
                            isNew = false;
                            newId = id;
                        }

                        if(isNew)
                        {
                            this.newTags.push({id : newId, name : value});
                            this.allTags = this.props.hotTags.concat(this.props.commonTags, this.newTags);
                        }
                        else if($.inArray(newId, this.state.value) != -1)
                        {
                            isAdd = false;
                        }

                        if(isAdd)
                        {
                            this.state.value.push(newId);
                            this.setState({value : this.state.value});
                        }
                    },
                },
            ]
        )
    }

    // 获取已选标签
    getValue = value => {
        if(!value)
        {
            value = [];
        }
        else if(Object.prototype.toString.call(value) == '[object String]')
        {
            let tempValue = value.split(',');
            value = [];
            tempValue.map((v, k) => {
                value[k] = parseInt(v);
            })
        }
        return value;
    }

    // 获取标签
    getTag = (id, name, closable=false, isChoose=true) => {
        let color = null;
        if($.inArray(id, this.state.value) != -1)
        {
            // 已选
            color = 'red';
        }

        return(
            <Tag key={id} color={color} closable={closable}
                 onClick={e => {
                     if(!isChoose)
                     {
                         return;
                     }

                     // 取消选择
                     if(color == 'red')
                     {
                         setTimeout(() => {
                             this.state.value.splice($.inArray(id, this.state.value),1);
                             this.setState({value : this.state.value});
                         }, 200);
                     }
                     // 选择
                     else
                     {
                         if(this.isAdd())
                         {
                             this.state.value.push(id);
                             this.setState({value : this.state.value});
                         }
                     }
                 }}
            >
                {name}
            </Tag>
        )
    }

    // 判断最大选择
    isAdd = () => {
        let isAdd = true;
        if(this.props.maxNum != -1 && this.state.value.length >= this.props.maxNum)
        {
            Toast.info(<ToastContent type="fail" content={`最多只能选择 ${this.props.maxNum} 个${this.props.labelName}`} />, 3, null, false);
            isAdd = false;
        }
        return isAdd;
    }

    /**
     * 获取标签名
     * @param   tags 标签数组
     * @param   id   ID
     */
    getName = (tags, id) => {
        let name = null;
        tags.map((v, k) => {
            if(v['id'] == id)
            {
                name = v['name'];
                return false;
            }
        })
        return name;
    }

    /**
     * 获取标签ID
     * @param   tags 标签数组
     * @param   name 标签名
     */
    getId = (tags, name) => {
        let id = null;
        tags.map((v, k) => {
            if(v['name'] == name)
            {
                id = v['id'];
                return false;
            }
        })
        return id;
    }

    render()
    {
        let className = `component-TagItem`;
        let componentClassName = className;

        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }
        // 不可编辑
        if(!this.props.editable)
        {
            componentClassName += ` ${className}-readonly`;
        }

        // 已选展示
        let selectedTagsShow = [];
        this.state.value.map((v, k) => {
            selectedTagsShow.push(this.getTag(v, this.getName(this.allTags, v), false, false));
        })

        // 已选
        let selectedTags = [];
        this.state.value.map((v, k) => {
            selectedTags.push(this.getTag(v, this.getName(this.allTags, v), true));
        })

        // 热门
        let hotTags = null;
        if(this.props.hotTags)
        {
            hotTags = [];
            this.props.hotTags.map((v, k) => {
                hotTags.push(this.getTag(v.id, v.name));
            })
        }

        // 其他
        let commonTags = null;
        if(this.props.commonTags)
        {
            commonTags = [];
            this.props.commonTags.map((v, k) => {
                commonTags.push(this.getTag(v.id, v.name));
            })
        }

        return(
            <List.Item className={componentClassName} arrow={this.props.editable ? 'horizontal' : ''} onClick={this.select}>
                <div className={`${className}-content`}>
                    <div className={`${className}-label`}>{this.props.labelName}</div>
                    <div className={`${className}-control`} style={{width : document.body.clientWidth - 142}}>
                        {selectedTagsShow}
                    </div>
                </div>

                <Modal className={`${className}-modal`} isShow={this.state.isSelect} positionY={'bottom'} hideWidth={$(window).width()} contentStyle={{backgroundColor : '#f2f2f2'}}>
                    <div className={`${className}-select-border`} style={{width : $(window).width(), height : $(window).height() * 0.9}}>
                        <div className={`${className}-select-list`}>
                            {/*已选标签*/}
                            <ModularContainer name={`已选${this.props.labelName}`} borderTop={false}>
                                {selectedTags}
                            </ModularContainer>
                            {/*热门标签*/}
                            <ModularContainer name={`热门${this.props.labelName}`}>
                                {hotTags}
                            </ModularContainer>
                            {/*其他标签*/}
                            <ModularContainer name={`其他${this.props.labelName}`}>
                                {commonTags}
                            </ModularContainer>
                        </div>

                        <Row className={`${className}-select-button`}>
                            <Col span={8}>
                                <Button name={'取消'} type={'weaken'} action={this.cancel} />
                            </Col>
                            <Col span={8}>
                                <Button name={'新增'} type={'weaken'} isSideBorder={true} sideBorderSize={'half'} action={this.add} />
                            </Col>
                            <Col span={8}>
                                <Button name={'确定'} type={this.props.submitButtonType} action={this.submit} />
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </List.Item>
        )
    }
}

export default TagItem;
