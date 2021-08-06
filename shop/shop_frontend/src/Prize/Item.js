import { postBackend } from '../Backend/Backend';
import React from 'react';
import { Row, Col} from 'react-bootstrap';
import PausedButton from '../Controls/PausedButton';

export default function PrizeItem(props) {
    var date = new Date(props.item.date_purchased)
    if (props.item.date_taken) {
        var dateTaken = new Date(props.item.date_taken)
        dateTaken = dateTaken.toLocaleDateString("ru") + " " + dateTaken.toLocaleTimeString("ru")
    }
    return (
        <Row>
            <Col xs={2}><img src={props.item.picture} width={128}/></Col>
            <Col xs={2}>{props.item.name}</Col>
            <Col xs={2}>{props.item.full_name}</Col>
            <Col xs={2}>{date.toLocaleDateString("ru") + " " + date.toLocaleTimeString("ru")}</Col>
            {props.showTaken && dateTaken
                && <Col xs={2}>{dateTaken}</Col>
                //: <div/>
            }
            <Col xs={1}>
                {(props.auth.is_staff
                    || props.auth.tokens >= props.item.price)
                    && props.actionText
                    ? <PausedButton
                        onClick={() => {
                            if (props.actionUrl)
                                postBackend(props.actionUrl, {}, {id:props.item.id},
                                    () => {
                                        if (props.onChange)
                                            props.onChange();
                                    })
                        }}
                        variant="outline-primary">{props.actionText}</PausedButton>
                    : ""
                }
            </Col>
        </Row>
    );
}
