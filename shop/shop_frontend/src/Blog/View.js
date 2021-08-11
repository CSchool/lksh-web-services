import { fetchBackend, postBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FormatDate } from '../Utils/Utils';
import { MultilineText } from '../Controls/MultilineText';

export default function ViewPost(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("posts/" + props.match.params.id + "/", {},
            setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!data || !data.id)
        return "";

    return (
        <Container>
            <h2>{data.title}</h2>
            <Row className="mt-3">
                <Col>{data.owner_first_name + " " + data.owner_last_name}</Col>
                <Col>{FormatDate(data.created)}</Col>
            </Row>
            <Row className="mt-3">
                <Col><MultilineText text={data.body} /></Col>
            </Row>
        </Container>
    );
};
