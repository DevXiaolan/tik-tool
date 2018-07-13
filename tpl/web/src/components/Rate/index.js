import React, {Component, PropTypes} from 'react';
import {Rate as RateAntd} from 'antd';
import Icon from 'components/Icon';
import browserAttr from 'utils/browserAttr';

import './style.scss';

class Rate extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        // 大小
        this.size = this.getSize(props.size);
    }

    static propTypes =
    {
        // 大小
        size            :   React.PropTypes.oneOf(['x-small', 'small', 'large', 'normal']),
    }

    static defaultProps =
    {
        // 大小
        size            :   'normal'
    }

    componentWillReceiveProps(nextProps) {
        this.size = this.getSize(nextProps.size);
    }

    getSize = size => {
        // 非移动端
        if(!browserAttr.versions.mobile)
        {
            if(size == 'x-small' || size == 'small')
            {
                size = 'large';
            }
        }
        return size;
    }

    render()
    {
        let className = 'component-Rate';
        let componentClassName = `${className} ${className}-${this.size}`;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        let props = {...this.props};
        delete props.className;

        if(!props.value)
        {
            props.value = 0;
        }
        const value = Math.floor(props.value);
        props.value = props.value == value ? value : props.value > value + 0.5 ? value + 1 : value + 0.5;

        return(
            <RateAntd className={componentClassName} character={<Icon className={`${className}-icon`} classType={'it'} type="xing" />} {...props} />
        )
    }
}

export default Rate;
