import fetchBackend from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { UserLink } from '../Controls/Links'
import Button from 'react-bootstrap/Button';

function UsersLine(props) {
    return (
        <Row>
            <Col xs={2}>
                {props.item.profile.picture
                    ? <img src={props.item.profile.picture} style={{maxWidth:128,}} alt=""/>
                    : ""}
            </Col>
            <Col xs={3}><UserLink id={props.item.pk} text={props.item.full_name}/></Col>
            <Col xs={1}>{props.item.profile.tokens}</Col>
        </Row>
    );
}

export default function UserList(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("users/", {}, setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <h2>{"Пользователи"}</h2>
            {props.auth.is_staff
                ? <>
                    <Button href="/createuser">{"Добавить пользователя"}</Button>
                  </>
                : ""
            }
            <Row>
                <Col xs={2}></Col>
                <Col xs={3}>{"Имя"}</Col>
                <Col xs={1}>{"Баллов"}</Col>
            </Row>
            {data.map(item => {
                return (
                    <UsersLine key={item.pk} item={item}
                        auth={props.auth}/>
                );
            })}
        </Container>
    );
}
