import React from 'react';
import { Row, Col} from 'react-bootstrap';
import { FormatDate } from '../Utils/Utils';
import { MultilineText } from '../Controls/MultilineText';
import { UserLink } from '../Controls/Links';

export default function MessageBody(props) {
    return (
        <Row>
            <Col xs="auto">
                <Row className="mt-1">
                    <img src={props.owner_picture} alt="" style={{maxWidth:128,}}/>
                </Row>
                <Row className="mt-1"><Col>
                    <UserLink id={props.owner_id}
                        text={props.owner_first_name + " " + props.owner_last_name}/>
                </Col></Row>
                <Row className="mt-1">
                    <Col>{FormatDate(props.created)}</Col>
                </Row>
            </Col>
            <Col>
            <Row className="mt-3">
                <Col><MultilineText text={props.body} /></Col>
            </Row>
            </Col>
        </Row>
    );
}
