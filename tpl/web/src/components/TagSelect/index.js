import React, {Component, PropTypes} from 'react';
import {Tag} from 'antd';
import {Toast} from 'antd-mobile';
import ToastContent from 'components/ToastContent';

import $ from 'jquery';

import './style.scss';

class TagSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.value = this.getValue(props.value);
    }

    static propTypes =
    {
        // 名
        name                    :   React.PropTypes.string,
        // 标签值名列表 [{name, value}]
        tags                    :   React.PropTypes.array,
        // 已选标签值列表
        value                   :   React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        // 已选颜色 pink red orange green cyan blue purple
        selectedColor           :   React.PropTypes.string,
        // 最大选择数 (-1不限)
        maxSelected             :   React.PropTypes.number,
        // 最大是否提示 (不提示将替换首个值)
        isPromptMax             :   React.PropTypes.bool,
        // 最小选择数
        minSelected             :   React.PropTypes.number,
        // 最小是否提示 (不提示将替换首个值)
        isPromptMin             :   React.PropTypes.bool,
        /**
         * 改变时
         * @param value  新值
         */
        onChange                :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 名
        name                    :   '',
        // 标签值名列表 [{name, value}]
        tags                    :   [],
        // 已选标签值
        value                   :   [],
        // 已选颜色 pink red orange green cyan blue purple
        selectedColor           :   'red',
        // 最大选择数 (-1不限)
        maxSelected             :   -1,
        // 最大是否提示 (不提示将替换首个值)
        isPromptMax             :   false,
        // 最小选择数
        minSelected             :   0,
        // 最小是否提示 (不提示将不变)
        isPromptMin             :   false,
        /**
         * 改变时
         * @param value  新值
         */
        onChange                :   value => {}
    }

    componentWillReceiveProps(props)
    {
        this.value = this.getValue(props.value);
    }

    getValue = value => {
        if(Object.prototype.toString.call(value) == '[object String]')
        {
            value = value.split(',');
        }
        return [...value];
    }

    render()
    {
        let className = `component-TagSelect`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let tags = [];
        this.props.tags.map((v, k) => {
            const index = this.value ? $.inArray(v.value, this.value) : -1;
            tags.push(
                <Tag
                    key={k}
                    color={index != -1 ? this.props.selectedColor : null}
                    onClick={() => {
                        let isChange = true;
                        if(index != -1)
                        {
                            if(this.value.length <= this.props.minSelected)
                            {
                                isChange = false;
                                if(this.props.isPromptMin)
                                {
                                    Toast.info(<ToastContent type="fail" content={`最少选择 ${this.props.minSelected} 个${this.props.name}`} />, 3, null, false);
                                }
                            }
                            else
                            {
                                this.value.splice(index, 1);
                            }
                        }
                        else
                        {
                            if(!this.value)
                            {
                                this.value = [v.value];
                            }
                            else if(this.props.maxSelected != -1 && this.value.length >= this.props.maxSelected)
                            {
                                if(this.props.isPromptMax)
                                {
                                    Toast.info(<ToastContent type="fail" content={`最多只能选择 ${this.props.maxSelected} 个${this.props.name}`} />, 3, null, false);
                                    isChange = false;
                                }
                                else
                                {
                                    // 重置首个值
                                    this.value.splice(0, 1);
                                    this.value.push(v.value);
                                }
                            }
                            else
                            {
                                this.value.push(v.value);
                            }
                        }
                        if(isChange)
                        {
                            this.props.onChange(this.value);
                        }
                    }}
                >
                    {v.name}
                </Tag>
            );
        })

        return(
            <div className={componentClassName}>
                {tags}
            </div>
        )
    }
}

export default TagSelect;
