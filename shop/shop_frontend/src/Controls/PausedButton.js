import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'


export default class PausedButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled : false
        };
    }

    handleClick = (event) => {
        if (!window.confirm("Вы уверены?")) {
            return;
        }
        this.setState({disabled: true},
            () => {
                if (this.props.onClick) {
                    this.props.onClick();
                }
                setTimeout(() => this.setState({disabled:false}), this.props.pause * 1000);
            });
    }

    render() {
        return (
            <Button variant={this.props.variant}
                onClick={this.handleClick}
                disabled={this.state.disabled || this.props.disabled}>
                {this.props.children}
            </Button>
        )
    }
}

PausedButton.defaultProps = {
    pause: 10,
    disabled: false,
}

PausedButton.propTypes = {
    pause: PropTypes.number,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    onClick: PropTypes.func,
}
