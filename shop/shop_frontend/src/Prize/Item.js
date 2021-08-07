import React from 'react';
import { Row, Col} from 'react-bootstrap';

export default function PrizeItem(props) {
    var date = new Date(props.item.date_purchased)
    if (props.item.date_taken) {
        var dateTaken = new Date(props.item.date_taken)
        dateTaken = dateTaken.toLocaleDateString("ru") + " " + dateTaken.toLocaleTimeString("ru")
    }
    return (
        <Row>
            <Col xs={2}><img src={props.item.picture} width={128}/></Col>
            <Col xs={2}><a href={"shopitem/" + props.item.class_id}>{props.item.name}</a></Col>
            <Col xs={2}>{props.item.full_name}</Col>
            <Col xs={2}>{date.toLocaleDateString("ru") + " " + date.toLocaleTimeString("ru")}</Col>
            {props.showTaken && dateTaken
                && <Col xs={2}>{dateTaken}</Col>
                //: <div/>
            }
            {props.buttons.map((btn, idx) =>
                <Col xs={1} key={idx}>
                    {btn}
                </Col>)
            }
        </Row>
    );
}
