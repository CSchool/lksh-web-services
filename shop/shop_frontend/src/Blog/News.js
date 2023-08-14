import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import MessageBody from './MessageBody';

function NewsLine(props) {
    return (
        <>
            <Row className="mt-5">
                <Col xs={8} style={{wordWrap:"break-word"}}><a href={"/post/" + props.item.id}>
                    <h3>{props.item.title}</h3></a></Col>
            </Row>
            <MessageBody {...props.item} />
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
