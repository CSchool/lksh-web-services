import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';


export default class PausedButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled : false
        };
    }

    handleClick = (event) => {
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true},
            () => {
                if (this.props.onClick) {
                    this.props.onClick();
                }
                // enable it after 10 seconds
                setTimeout(() => this.setState({disabled:false}), 10000);
            });
    }

    render() {
        return (
            <Button variant={this.props.variant}
                onClick={this.handleClick} disabled={this.state.disabled}>
                {this.props.children}
            </Button>
        )
    }
}
