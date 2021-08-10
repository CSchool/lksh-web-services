import { BackendURL, postBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { UserLink } from '../Controls/Links';
import { FormatDate } from '../Utils/Utils';

function NewsLine(props) {
    return (
        <>
            <Row className="mt-5">
                <Col xs={8}><a href={"/post/" + props.item.id}>
                    <h3>{props.item.title}</h3></a></Col>
                <Col xs={2}><UserLink id={props.item.owner_id}
                    text={props.item.owner_first_name + " " + props.item.owner_last_name}/>
                </Col>
                <Col xs={2}>{FormatDate(props.item.created)}</Col>
            </Row>
            <Row>
                <Col xs={12}>{props.item.body}</Col>
            </Row>
        </>
    );
}

export default function News(props) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const result = await axios(
          BackendURL("posts/"),
        );
        setData(result.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <h2>{"Новости и объявления"}</h2>
            {data.map(item => {
                return (
                    <NewsLine key={item.id} item={item}
                        auth={props.auth}
                        onChange={fetchData}/>
                );
            })}
        </Container>
    );
}
