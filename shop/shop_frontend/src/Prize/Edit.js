import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { patchBackend, fetchBackend } from '../Backend/Backend';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import PausedButton from '../Controls/PausedButton';

export default function PrizeEdit(props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [count, setCount] = useState(0);
    const [picture, setPicture] = useState("");

    const fetchData = () => {
        fetchBackend("prizeclasses/" + props.match.params.id + "/", {},
            (data) => {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setCount(data.count);
                setPicture(data.picture);
            });
    };

    const saveItem = () => {
        patchBackend('prizeclasses/' + props.match.params.id + "/", {},
            {name: name, description: description, price: price,
            count: count},
        () => {
            props.history.push("/shopitem/" + props.match.params.id + "/");
        });
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    if (!props.auth.is_staff) {
        return "";
    }

    return (
        <Container>
            <h2>{"Приз:"}</h2>
            <Row>
                <Col><img src={picture} alt=""/></Col>
            </Row>
            <Row>
                <Col>
                <Form.Control type="text" id="name"
                    onChange={e => setName(e.target.value)}
                    value={name}/>
                </Col>
            </Row>
            <Row>
                <Col>
                <Form.Control as="textarea" id="description"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    rows={3}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>{"Стоимость: "}</Col>
                <Col xs={3}>
                    <Form.Control type="number" id="price"
                        onChange={e => setPrice(e.target.value)}
                        value={price}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>{"Осталось штук: "}</Col>
                <Col xs={3}>
                    <Form.Control type="number" id="count"
                        onChange={e => setCount(e.target.value)}
                        value={count}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <PausedButton onClick={saveItem}
                        disabled={name === ""
                            || description === ""
                            || count <= 0
                            || price <= 0}>
                        {"Сохранить"}
                    </PausedButton>
                </Col>
            </Row>
        </Container>
    );
}
