import { fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import PrizeItem from './Item';
import PostPausedButton from '../Controls/PostPausedButton';

export default function ItemList(props) {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetchBackend("prizeitems/", {}, setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={2}></Col>
                <Col xs={1}>{"Приз"}</Col>
                <Col xs={2}></Col>
                <Col xs={2}>{"Получатель"}</Col>
                <Col xs={1}>{"Дата"}</Col>
                {props.showTaken
                    ? <Col xs={2}>{"Получено"}</Col>
                    : <div/>
                }
                <Col xs={1}></Col>
            </Row>
            {data.map(item => {
                var buttons = []
                if (props.giveButton && props.auth.is_staff) {
                    buttons.push(<PostPausedButton
                        actionUrl={"give/"}
                        actionId={item.id}
                        onChange={fetchData}
                        variant="outline-primary">
                        {"Выдать"}
                    </PostPausedButton>);
                }
                if (props.undoButton && props.auth.is_staff) {
                    buttons.push(<PostPausedButton
                        actionUrl={"undo/"}
                        actionId={item.id}
                        onChange={fetchData}
                        variant="outline-danger">
                        {"Отменить"}
                    </PostPausedButton>);
                }
                return (
                    <PrizeItem key={item.id} item={item}
                        auth={props.auth}
                        showTaken={props.showTaken}
                        buttons={buttons}>
                    </PrizeItem>
                );
            })}
        </Container>
    );
}
