import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import './style.scss';

class ScrollFixed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否固定
            isFixed     :   false
        };
    }

    static propTypes =
    {
        // 命名   (尽量唯一)
        name            :   React.PropTypes.string.isRequired,
        // 参考DOM
        targetDom       :   React.PropTypes.object,
        // 偏移量
        offset          :   React.PropTypes.number
    }

    static defaultProps =
    {
        // 偏移量
        offset          :   0
    }

    componentDidMount() {
        $(window).on(`scroll.${this.props.name}`, () => {
            this.setState({isFixed : this.props.targetDom && $(document).scrollTop() >= $(this.props.targetDom).offset().top + this.props.offset});
        });
    }

    componentWillUnmount() {
        $(window).off(`scroll.${this.props.name}`);
    }

    render()
    {
        let className = 'component-ScrollFixed';
        let componentClassName = className;
        if(this.props.className)
        {
            componentClassName += ` ${this.props.className}`;
        }

        // 固定
        if(this.state.isFixed)
        {
            componentClassName += ` ${className}-fixed`;
        }

        return(
            <div className={componentClassName}>
                {this.props.children}
            </div>
        )
    }
}

export default ScrollFixed;
