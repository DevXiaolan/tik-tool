import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Modal} from 'antd';

import './style.scss';

class ModalAntd extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.key = new Date().getTime();
    }

    static propTypes =
    {
        // 位置
        position        :   React.PropTypes.oneOf(['top', 'center', 'bottom'])
    }

    static defaultProps =
    {
        // 位置
        position        :   'center'
    }

    render()
    {
        let props = {...this.props};
        let className = `component-ModalAntd`;
        let componentClassName = `${className} ${className}-${this.props.position}`;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
            delete props.className;
        }
        delete props.position;

        return(
            <Modal className={`${componentClassName} ant-modal-empty`} key={this.key} {...props} footer={null} closable={false} width={document.body.clientWidth} height={document.body.clientHeight}>
                <div
                    className={`${className}-border`}
                    onWheel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onMouseMove={e => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onTouchMove={e => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    {this.props.children}
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAntd);
