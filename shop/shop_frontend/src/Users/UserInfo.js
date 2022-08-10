import { fetchBackend, uploadBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import FileUploader from '../Controls/FileUploader';
import { FormatDate } from '../Utils/Utils';
import Owned from '../Prize/Owned';

export default function UserInfo(props) {
    const [data, setData] = useState([]);
    const [tokens, setTokens] = useState([]);

    const fetchData = () => {
        fetchBackend("users/" + props.match.params.id + "/", {},
            setData);
        if (props.auth.is_staff) {
            fetchBackend("tokentransfers/", {to:props.match.params.id},
                setTokens);
        }
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
            {props.auth.is_staff
                ? <Row>
                    <Col xs={6}>{"Баллы: "}{data.profile.tokens}</Col>
                  </Row>
                : ""
            }
            <Row><Col>
                {props.auth.is_staff
                    ? <FileUploader text={"Загрузить фото"}
                        onFileSelect={uploadPhoto} />
                    : ""
                }
            </Col></Row>
            {props.auth.is_staff
                ? <>
                    <h3>{"Получены призы"}</h3>
                    <Owned auth={props.auth} user={props.match.params.id}/>
                    <h3>{"Начислены баллы"}</h3>
                    <Row><Col xs={4}>{"Дата"}</Col><Col xs={2}>{"Сколько"}</Col><Col xs={4}>{"От кого"}</Col></Row>
                    {tokens.map(token => {
                        return (<Row key={token.id}>
                            <Col xs={4}>{FormatDate(token.created)}</Col>
                            <Col xs={2}>{token.count}</Col>
                            <Col xs={4}>{token.from_user_full_name}</Col>
                        </Row>);
                    })}
                  </>
                : ""
            }
        </Container>
    );
}
