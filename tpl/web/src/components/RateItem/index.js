import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'antd';
import {List} from 'antd-mobile';
import Rate from 'components/Rate';
import './style.scss';

class RateItem extends Component {
    static propTypes =
    {
        // 标签名
        labelName      : React.PropTypes.string.isRequired
    }

    render()
    {
        let className = 'component-RateItem';
        if(this.props.className)
        {
            className += ` ${this.props.className}`;
        }

        let props = {...this.props};
        delete props.className;
        delete props.labelName;

        return(
            <List.Item>
                <Row className={className}>
                    <Col className="component-RateItem-label" span="6">{this.props.labelName}</Col>
                    <Col className="component-RateItem-border" span="12">
                        <Rate className="component-RateItem-star" {...props} />
                    </Col>
                </Row>
                <List.Item.Brief>{this.props.children}</List.Item.Brief>
            </List.Item>
        )
    }
}

export default RateItem;
