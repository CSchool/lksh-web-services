import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import PrizeItem from './Item';

export default function ItemList(props) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        fetchBackend("prizeitems/", {}, setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={2}></Col>
                <Col xs={2}>{"Приз"}</Col>
                <Col xs={2}>{"Получатель"}</Col>
                <Col xs={2}>{"Дата"}</Col>
                {props.showTaken
                    ? <Col xs={2}>{"Получено"}</Col>
                    : <div/>
                }
                <Col xs={1}></Col>
            </Row>
            {data.map(item => {
                return (
                    <PrizeItem key={item.id} item={item}
                        auth={props.auth}
                        actionUrl={props.actionUrl}
                        actionText={props.actionText}
                        showTaken={props.showTaken}
                        onChange={fetchData}/>
                );
            })}
        </Container>
    );
}
