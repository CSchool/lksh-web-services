import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { UserLink } from '../Controls/Links';
import { FormatDate } from '../Utils/Utils';
import Button from 'react-bootstrap/Button'
import { MultilineText } from '../Controls/MultilineText';

function NewsLine(props) {
    return (
        <>
            <Row className="mt-5">
                <Col xs={8}><a href={"/post/" + props.item.id}>
                    <h3>{props.item.title}</h3></a></Col>
                <Col xs="auto"><UserLink id={props.item.owner_id}
                    text={props.item.owner_first_name + " " + props.item.owner_last_name}/>
                </Col>
                <Col xs="auto">{FormatDate(props.item.created)}</Col>
            </Row>
            <Row>
                <Col xs={12}><MultilineText text={props.item.body} /></Col>
            </Row>
            <Row>
                <Col>{"Комментариев: "}{props.item.comment_count}</Col>
            </Row>
        </>
    );
}

export default function News(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("posts/", {}, setData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <h2>{"Новости и объявления"}</h2>
            {props.auth.isAuthenticated
                ? <Button type="link" href="/newpost">{"Новое объявление"}</Button>
                : ""
            }
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
