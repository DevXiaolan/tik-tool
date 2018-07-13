import React, {Component, PropTypes} from 'react';
import Button from 'components/Button';
import CheckBox from 'components/CheckBox';
import $ from 'jquery';

import './style.scss';

class CheckBoxGroup extends Component {
    constructor(props){
        super(props);

        this.state = {
            checkList : []
        };
    }

    static propTypes = {
        // 默认选中的选项
        defaultValue            :   React.PropTypes.array,
        // 指定选中的选项
        value                   :   React.PropTypes.array,
        // 变化时回调函数
        onChange                :   React.PropTypes.func,
        // 选项
        option                  :   React.PropTypes.array,
        // 点击事件的回调函数
        action                  :   React.PropTypes.func
    }

    static defaultTypes = {
        // 默认选中的选项
        defaultValue            :   [],
        // 指定选中的选项
        value                   :   [],
        // 变化时回调函数
        onChange                :   () => {},
        // 选项
        option                  :   [],
        // 点击事件的回调函数
        action                  :   () => {}
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let className = `component-CheckBoxGroup`;
        let componentClassName = `${className}`;
        if(this.props.className) {
            componentClassName += ` ${this.props.className}`;
        }


        let checkbox = null,
            checkboxList = [];
        this.props.option.map((v, k) => {
            checkbox =
                <CheckBox
                    key={k}
                    id={k}
                    checked={this.state.checkList[k]}
                    onChange={this.props.onChange}
                    action={this.props.action}
                >
                    {v}
                </CheckBox>
            checkboxList.push(checkbox)
        })

        return(
            <div className={componentClassName}>
                {/*<Button name={'全选'}  style={{}} type={'weaken'}*/}
                {checkboxList}
            </div>
        )
    }
}

export default CheckBoxGroup;