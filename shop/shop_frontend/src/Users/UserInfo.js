import { fetchBackend, uploadBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import FileUploader from '../Controls/FileUploader';

export default function UserInfo(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("users/" + props.match.params.id + "/", {},
            setData);
    };

    const uploadPhoto = (file) => {
        uploadBackend('userphoto/', { user: props.match.params.id },
            file, fetchData);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    if (!data || !data.pk)
        return "";

    return (
        <Container>
            <h2>{"Пользователь "}{data.full_name}</h2>
            <Row>
                <Col xs={6}><img src={data.profile.picture} style={{maxWidth:300,}} alt=""/></Col>
            </Row>
            <Row>
                <Col xs={6}>{"Баллы: "}{data.profile.tokens}</Col>
            </Row>
            <Row><Col>
                {props.auth.is_staff
                    ? <FileUploader text={"Загрузить фото"}
                        onFileSelect={uploadPhoto} />
                    : ""
                }
            </Col></Row>
        </Container>
    );
}
