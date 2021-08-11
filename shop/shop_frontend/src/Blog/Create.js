import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import fetchBackend, { postBackend } from '../Backend/Backend'
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class PostCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:"",
            body:"",
        };
    }

    handleConfirm = event => {
        postBackend('posts/', {}, {title: this.state.title, body: this.state.body},
            () => {
                this.props.history.push("/");
            });
    }

    handleInput = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    render() {
        return (
            <Container>
                <h2>{"Новое объявление"}</h2>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Тема"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="title"
                            onChange={this.handleInput}
                            value={this.state.title}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Сообщение"}</Form.Label>
                    <Col>
                        <Form.Control as="textarea" id="body"
                            onChange={this.handleInput}
                            value={this.state.body}
                            rows={8}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Col>
                        <Button onClick={this.handleConfirm}>
                            {"Создать"}
                        </Button>
                    </Col>
                </Form.Group>
            </Container>
        );
    }
}
