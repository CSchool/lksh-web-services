import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { ShopItemLink } from '../Controls/Links';
import Button from 'react-bootstrap/Button';
import BuyButton from './Buy';

function ShopLine(props) {
    return (
        <Row className="mt-3">
            <Col xs={2}><img src={props.item.picture} style={{maxWidth:128,}} alt=""/></Col>
            <Col xs={2}><ShopItemLink id={props.item.id} text={props.item.name}/></Col>
            <Col xs={4}>{props.item.description}</Col>
            <Col xs={1}>{props.item.price}</Col>
            <Col xs={1}>{props.item.count}</Col>
            {props.old ? "" : <Col xs={2}><BuyButton item={props.item} auth={props.auth} /></Col>}
        </Row>
    );
}

export default function Shop(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("prizeclasses/", {old:props.old}, setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <h2>{"Магазин удивительных призов"}</h2>
            {props.auth.is_staff
                ? <>
                    <Row>
                        <Col>
                            {"Стоимость всего набора призов: "}
                            {data.reduce((v, item) => (v + item.count * item.price), 0)}
                        </Col>
                    </Row>
                    <Button href="/createprize">{"Добавить новый"}</Button>
                  </>
                : ""
            }
            <Row>
                <Col xs={2}></Col>
                <Col xs={2}>{"Приз"}</Col>
                <Col xs={4}>{"Описание"}</Col>
                <Col xs={1}>{"Стоимость"}</Col>
                <Col xs={2}>{"Осталось штук"}</Col>
                <Col xs={1}></Col>
            </Row>
            {data.map(item => {
                return (
                    <ShopLine key={item.id} item={item}
                        auth={props.auth}
                        old={props.old}
                        onChange={fetchData}/>
                );
            })}
        </Container>
    );
}
