import { fetchBackend, postBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import PausedButton from '../Controls/PausedButton';
import Button from 'react-bootstrap/Button';

export default function ShopItem(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("prizeclasses/" + props.match.params.id + "/", {},
            setData);
    };

    const buyItem = () => {
        postBackend("buy/", {}, {id:props.match.params.id},
        () => {
            fetchData();
            props.auth.userRefresh(true);
        })
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    if (!data || !data.id)
        return "";

    return (
        <Container>
            <h2>{"Приз "}{data.name}</h2>
            <Row>
                <Col xs={6}><img src={data.picture} alt=""/></Col>
                <Col xs={6}>{data.description}</Col>
            </Row>
            <Row>
                <Col xs={3}>{"Стоимость: "}{data.price}</Col>
                <Col xs={3}>{"Осталось штук: "}{data.count}</Col>
                <Col xs={3}>
                    {props.auth.isAuthenticated
                        && data.count > 0
                        && props.auth.tokens >= data.price
                        ? <PausedButton
                            onClick={buyItem}
                            variant="outline-primary">{"Купить"}
                          </PausedButton>
                        : ""
                    }
                </Col>
                {props.auth.is_staff
                    ? <Col><Button href={"/editprize/" + data.id}>{"Редактировать"}</Button></Col>
                    : ""
                }
            </Row>
        </Container>
    );
}
