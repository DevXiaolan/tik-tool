import React, {Component, PropTypes} from 'react';

import './style.scss';

class SegmentedControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前选中编号
            index : props.initIndex
        }
    }

    static propTypes =
    {
        // 值列表
        values              :   React.PropTypes.array,
        // 初始选中编号
        initIndex           :   React.PropTypes.number,
        // 当前选中编号 (当有此值时将忽略initIndex和state.index)
        index               :   React.PropTypes.number,
        // 颜色
        color               :   React.PropTypes.string,
        // item样式
        itemStyle           :   React.PropTypes.object,
        // 改变
        onChange            :   React.PropTypes.func
    }

    static defaultProps =
    {
        // 值列表
        values              :   [],
        // 选中编号
        initIndex           :   0,
        // 当前选中编号 (当有此值时将忽略initIndex和state.index)
        index               :   null,
        // 颜色
        color               :   '#000',
        // item样式
        itemStyle           :   {},
        // 改变
        onChange            :   index => {}
    }

    render()
    {
        let className = `component-SegmentedControl`;
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let items = [];
        const index = this.props.index === null ? this.state.index : this.props.index;
        this.props.values.map((v, k) => {
            items.push(
                <div
                    key={k}
                    className={`${className}-item`}
                    style={{
                        ...this.props.itemStyle,
                        width : `${100/this.props.values.length}%`,
                        borderColor : this.props.color,
                        backgroundColor : k == index ? this.props.color : '#fff',
                        color : k == index ? '#fff' : '#000'
                    }}
                    onClick={() => {
                        if(this.props.index === null)
                        {
                            this.setState({index : k});
                        }
                        this.props.onChange(k);
                    }}
                >
                    {v}
                </div>
            );
        });

        return(
            <div className={componentClassName} style={{...this.props.style, borderColor : this.props.color}}>
                {items}
            </div>
        )
    }
}

export default SegmentedControl;