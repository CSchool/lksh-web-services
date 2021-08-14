import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { uploadBackend } from '../Backend/Backend';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FileUploader from '../Controls/FileUploader';

export default class PrizeCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            description:"",
            price: 0,
            count: 0,
            file: undefined,
        };
    }

    handleConfirm = event => {
        uploadBackend('prizeclasses/', {name: this.state.name,
                description: this.state.description, price: this.state.price,
                count: this.state.count}, this.state.file,
            () => {
                this.props.history.push("/shop");
            });
    }

    handleInput = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    render() {
        return (
            <Container>
                <h2>{"Новый приз"}</h2>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Название"}</Form.Label>
                    <Col>
                        <Form.Control type="text" id="name"
                            onChange={this.handleInput}
                            value={this.state.name}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Описание"}</Form.Label>
                    <Col>
                        <Form.Control as="textarea" id="description"
                            onChange={this.handleInput}
                            value={this.state.description}
                            rows={3}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Стоимость"}</Form.Label>
                    <Col>
                        <Form.Control type="number" id="price"
                            onChange={this.handleInput}
                            value={this.state.price}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-3">
                    <Form.Label column xs="1">{"Количество"}</Form.Label>
                    <Col>
                        <Form.Control type="number" id="count"
                            onChange={this.handleInput}
                            value={this.state.count}/>
                    </Col>
                </Form.Group>
                <Row className="mt-3">
                    <FileUploader onFileSelect={file => this.setState({file:file})}/>
                </Row>
                <Form.Group as={Row} className="mt-3">
                    <Col>
                        <Button onClick={this.handleConfirm}
                            disabled={this.state.file===undefined
                                || this.state.name === ""
                                || this.state.description === ""
                                || this.state.count <= 0
                                || this.state.price <= 0}>
                            {"Создать"}
                        </Button>
                    </Col>
                </Form.Group>
            </Container>
        );
    }
}
