import { BackendURL, postBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import PausedButton from '../Controls/PausedButton';
import { ShopItemLink } from '../Controls/Links';
import Button from 'react-bootstrap/Button';

function ShopLine(props) {
    return (
        <Row className="mt-3">
            <Col xs={2}><img src={props.item.picture} style={{maxWidth:128,}} alt=""/></Col>
            <Col xs={2}><ShopItemLink id={props.item.id} text={props.item.name}/></Col>
            <Col xs={4}>{props.item.description}</Col>
            <Col xs={1}>{props.item.price}</Col>
            <Col xs={1}>{props.item.count}</Col>
            <Col xs={1}>
                {props.auth.isAuthenticated
                    && props.auth.tokens >= props.item.price
                    ? <PausedButton
                        onClick={() =>
                            postBackend("buy/", {}, {id:props.item.id},
                                () => {
                                    if (props.onChange)
                                        props.onChange();
                                    props.auth.userRefresh(true);
                                })
                        }
                        variant="outline-primary">{"Купить"}</PausedButton>
                    : ""
                }
            </Col>
        </Row>
    );
}

export default function Shop(props) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const result = await axios(
          BackendURL("prizeclasses/"),
        );
        setData(result.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <h2>{"Магазин удивительных призов"}</h2>
            {props.auth.is_staff
                ? <Button href="/createprize">{"Добавить новый"}</Button>
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
                        onChange={fetchData}/>
                );
            })}
        </Container>
    );
}
