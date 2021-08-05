import { BackendURL, fetchBackend, postBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import PausedButton from '../Controls/PausedButton';

function ShopItem(props) {
    return (
        <Row>
            <Col xs={2}><img src={props.item.picture} width={128}/></Col>
            <Col xs={2}>{props.item.name}</Col>
            <Col xs={4}>{props.item.description}</Col>
            <Col xs={1}>{props.item.price}</Col>
            <Col xs={1}>{props.item.count}</Col>
            <Col xs={1}>
                {props.auth.isAuthenticated
                    && props.auth.tokens >= props.item.price
                    ? <PausedButton
                        onClick={() => postBackend("buy/", {}, {id:props.item.id})}
                        variant="outline-primary">{"Купить"}</PausedButton>
                    : ""
                }
            </Col>
        </Row>
    );
}

export function Shop(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            BackendURL("prizeclasses/"),
          );
          setData(result.data);
        };
        fetchData();
      }, []);

    return (
        <Container>
            <Row>
                <Col xs={2}></Col>
                <Col xs={2}>{"Приз"}</Col>
                <Col xs={4}>{"Описание"}</Col>
                <Col xs={1}>{"Стоимость"}</Col>
                <Col xs={1}>{"Осталось штук"}</Col>
                <Col xs={1}></Col>
            </Row>
            {data.map(item => {
                return (
                    <ShopItem key={item.id} item={item} auth={props.auth} />
                );
            })}
        </Container>
    );
}
