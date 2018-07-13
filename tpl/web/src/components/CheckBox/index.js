import React, {Component, PropTypes} from 'react';
import Icon from 'components/Icon';
import $ from 'jquery';

import './style.scss';

class CheckBox extends Component {
    constructor(props){
        super(props);

        this.state = {
            isChecked : false
        };

        this.id = new Date().getTime() + Math.random();
    }

    static propTypes = {
        // 指定当前是否选中
        checked             :   React.PropTypes.bool,
        // 初始是否选中
        defaultChecked      :   React.PropTypes.bool,
        // 变化时回调函数
        onChange            :   React.PropTypes.func
    }

    static defaultTypes = {
        // 指定当前是否选中
        checked             :   false,
        // 初始是否选中
        defaultChecked      :   false,
        // 变化时回调函数
        onChange            :   () => {}
    }

    componentWillMount() {

    }

    componentDidMount() {
        if(this.props.defaultChecked || this.props.checked) {
            this.change(true);
        }else{
            this.change(false)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.checked == true) {
            this.change(true);
        }else{
            this.change(false);
        }
    }

    change = type => {
        let status = null;
        type ? status = true : status = false;
        $(this.checkbox).attr('checked',status);
    }

    render() {
        let className = `component-CheckBox`;
        let componentClassName = `${className}`;
        if(this.props.className) {
            componentClassName += ` ${this.props.className}`;
        }

        return(
            <div className={componentClassName} onClick={() => {

                this.props.action(this.props.children)
            }}>
                <div className={`${className}-content`}>
                    <input type="checkbox"
                           className={`${className}-checkbox`}
                           onChange={this.props.onChange}
                           ref={dom => this.checkbox = dom}
                           id={this.id}/>
                    <label htmlFor={this.id}></label>
                </div>
                <div className={`${className}-item`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default CheckBox;