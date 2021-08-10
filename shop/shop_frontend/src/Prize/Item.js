import React from 'react';
import { Row, Col} from 'react-bootstrap';
import { ShopItemLink } from '../Controls/Links';
import { UserLink } from '../Controls/Links';

export default function PrizeItem(props) {
    var date = new Date(props.item.date_purchased)
    if (props.item.date_taken) {
        var dateTaken = new Date(props.item.date_taken)
        dateTaken = dateTaken.toLocaleDateString("ru") + " " + dateTaken.toLocaleTimeString("ru")
    }
    return (
        <Row>
            <Col xs={2}><img src={props.item.picture} width={128}/></Col>
            <Col xs={1}><ShopItemLink id={props.item.class_id} text={props.item.name}/></Col>
            <Col xs={2}>
                {props.item.owner_picture
                    ? <img src={props.item.owner_picture} width={128}/>
                    : ""
                }
            </Col>
            <Col xs={2}><UserLink id={props.item.owner_id} text={props.item.full_name}/></Col>
            <Col xs={1}>{date.toLocaleDateString("ru") + " " + date.toLocaleTimeString("ru")}</Col>
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
