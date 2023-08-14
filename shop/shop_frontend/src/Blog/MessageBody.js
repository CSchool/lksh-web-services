import React from 'react';
import { Row, Col} from 'react-bootstrap';
import { FormatDate } from '../Utils/Utils';
import { UserLink } from '../Controls/Links';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

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
                </Col>
                </Row>
                <Row className="mt-1">
                    <Col>{FormatDate(props.created)}</Col>
                </Row>
            </Col>
            <Col style={{wordWrap:"break-word"}}><ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{ props.body }</ReactMarkdown></Col>
        </Row>
    );
}
