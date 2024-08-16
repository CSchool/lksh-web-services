import { fetchBackend, deleteBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import BuyButton from './Buy';
import Button from 'react-bootstrap/Button';
import PausedButton from '../Controls/PausedButton';

function AuctionRequest(props) {
    const handleDelete = () => {
        deleteBackend("prizeauction/" + props.item.id + "/", {},
            () => {
                props.handleUpdate();
            });
    }

    return (<Row>
      <Col xs={3}>{props.item.user_first_name + " " + props.item.user_last_name}</Col>
      <Col xs={1}>{props.item.maxprice}</Col>
      <Col xs={1}>
          <PausedButton onClick={handleDelete}
                        variant="outline-danger">
                        {"Удалить"}
          </PausedButton>
      </Col>
    </Row>);
}

export default function ShopItem(props) {
    const [data, setData] = useState([]);
    const [auctionRequests, setAuctionRequests] = useState([]);

    const fetchData = () => {
        fetchBackend("prizeclasses/" + props.match.params.id + "/", {},
            setData);
    };

    const fetchAuctionData = () => {
        fetchBackend("prizeauction/", {prize:props.match.params.id},
            setAuctionRequests);
    };

    useEffect(() => {
        fetchData();
        if (props.auth.is_staff) {
            fetchAuctionData();
        }
        // eslint-disable-next-line
    }, []);

    if (!data || !data.id)
        return "";

    return (
        <Container>
            <h2>{"Приз "}{data.name}</h2>
            <Row>
                <Col xs={6}><img style={{maxWidth:512,maxHeight:512}} src={data.picture} alt=""/></Col>
                <Col xs={6}>{data.description}</Col>
            </Row>
            <Row>
                <Col xs={3}>{"Стоимость: "}{data.price}</Col>
                <Col xs={3}>{"Осталось штук: "}{data.count}</Col>
                <Col xs={3}><BuyButton auth={props.auth} item={data} /></Col>
                {props.auth.is_staff
                    ? <Col><Button href={"/editprize/" + data.id}>{"Редактировать"}</Button></Col>
                    : ""
                }
            </Row>
            {data.auction && props.auth.is_staff && auctionRequests.length > 0
                ? <>
                    <Row>
                      <h2>{"Заявки на аукцион"}</h2>
                    </Row>
                    <Row>
                      <Col xs={3}>Пользователь</Col><Col xs={1}>Цена</Col>
                    </Row>
                    {auctionRequests.map(r => <AuctionRequest item={r} key={r.user_id}
                        handleUpdate={fetchAuctionData}/>)}
                  </>
                : ""
            }
        </Container>
    );
}
