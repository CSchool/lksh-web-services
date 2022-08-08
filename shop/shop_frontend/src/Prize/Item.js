import React from 'react';
import { Row, Col} from 'react-bootstrap';
import { ShopItemLink } from '../Controls/Links';
import { UserLink } from '../Controls/Links';
import { FormatDate } from '../Utils/Utils';

export default function PrizeItem(props) {
    return (
        <Row className="mt-3">
            <Col xs={2}><img src={props.item.picture} style={{maxWidth:128,}} alt=""/></Col>
            <Col xs={1}><ShopItemLink id={props.item.class_id} text={props.item.name}/></Col>
            {props.showUser
                ? <>
                    <Col xs={2}>
                        {props.item.owner_picture
                            ? <img src={props.item.owner_picture} style={{maxWidth:128,}} alt=""/>
                            : ""
                        }
                    </Col>
                    <Col xs={2}><UserLink id={props.item.owner_id} text={props.item.full_name}/></Col>
                  </>
                : ""}
            <Col xs={1}>{FormatDate(props.item.date_purchased)}</Col>
            {props.showTaken
                ? <Col xs={2}>{FormatDate(props.item.date_taken)}</Col>
                : ""
            }
            {props.buttons.map((btn, idx) =>
                <Col xs={1} key={idx}>
                    {btn}
                </Col>)
            }
        </Row>
    );
}
