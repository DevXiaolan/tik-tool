import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Select as SelectAntd} from 'antd';
import Scroll from 'components/Scroll';
import browserAttr from 'utils/browserAttr';

import './style.scss';

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    static propTypes =
    {
        // 风格
        styleName               :   React.PropTypes.oneOf(['deepPurple']),
        // 最大高度
        maxHeight               :   React.PropTypes.number
    }

    static defaultProps =
    {
        maxHeight               :   200
    }

    render()
    {
        let props = {...this.props};

        let className = 'component-Select';
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        if(!browserAttr.versions.mobile)
        {
            componentClassName += ` ${className}-pc`;
        }

        if(this.props.styleName)
        {
            componentClassName += ` ${className}-${this.props.styleName}`;
        }

        return(
            <div
                className={componentClassName}
            >
                <SelectAntd
                    {...props}
                    getPopupContainer={() => this.scrollDom}
                >
                    {this.props.children}
                </SelectAntd>
                <Scroll
                    className={`${className}-scroll`}
                    getRef={scrollDom => this.scrollDom = scrollDom}
                    style={{maxHeight : this.props.maxHeight}}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Select);