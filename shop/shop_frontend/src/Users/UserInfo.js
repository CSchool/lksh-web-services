import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

export default function UserInfo(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("users/" + props.match.params.id + "/", {},
            setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!data || !data.pk)
        return "";

    return (
        <Container>
            <h2>{"Пользователь "}{data.full_name}</h2>
            <Row>
                <Col xs={6}><img src={data.profile.picture}/></Col>
            </Row>
            <Row>
                <Col xs={6}>{"Баллы: "}{data.profile.tokens}</Col>
            </Row>
        </Container>
    );
}
