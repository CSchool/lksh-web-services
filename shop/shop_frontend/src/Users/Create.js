import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { postBackend } from '../Backend/Backend';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class UserCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            firstname:"",
            lastname:"",
            password:"",
        };
    }

    handleConfirm = event => {
        postBackend('users/', {}, {username: this.state.username,
                password: this.state.password,
                first_name: this.state.firstname,
                last_name: this.state.lastname},
            () => {
                this.props.history.push("/users");
            });
    }

    handleInput = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    render() {
        return (
            <Container>
                <h2>{"Новый пользователь"}</h2>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Логин"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="username"
                            onChange={this.handleInput}
                            value={this.state.username}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Фамилия"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="lastname"
                            onChange={this.handleInput}
                            value={this.state.lastname}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Имя"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="firstname"
                            onChange={this.handleInput}
                            value={this.state.firstname}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Пароль"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="password"
                            onChange={this.handleInput}
                            value={this.state.password}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Col>
                        <Button onClick={this.handleConfirm}
                            disabled={this.state.username === ""
                                || this.state.firstname === ""
                                || this.state.lastname === ""
                                || this.state.password === ""}>
                            {"Создать"}
                        </Button>
                    </Col>
                </Form.Group>
            </Container>
        );
    }
}
