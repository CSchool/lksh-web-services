import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import PausedButton from '../Controls/PausedButton';
import { postBackend } from '../Backend/Backend';


function AuctionButton(props) {
    const [price, setPrice] = useState(props.item.user_bet);

    const addRequest = () => {
        postBackend("buy/", {}, {id:props.item.id, maxprice: price},
            () => {
                props.auth.userRefresh(true);
            })
    };

    if (props.auth.is_staff) {
        return "Аукцион";
    }

    return (<>
        <Form.Control type="number" id="price"
            onChange={e => setPrice(e.target.value)}
            value={price}/>
        <PausedButton onClick={addRequest}
            disabled={price > props.auth.tokens
                || price < props.item.price
            }
            variant="outline-info">
            {"Участвовать в аукционе"}
        </PausedButton>
    </>);
}

export default function BuyButton(props) {
    return (props.auth.isAuthenticated
        && props.auth.tokens >= props.item.price
        && props.item.count > 0
        ? <>
            {props.item.auction
               ? <AuctionButton item={props.item} auth={props.auth}/>
               : <PausedButton
                onClick={() =>
                    postBackend("buy/", {}, {id:props.item.id},
                        () => {
                            if (props.onChange)
                                props.onChange();
                            props.auth.userRefresh(true);
                        })
                }
                variant="outline-primary">
                {"Купить"}
            </PausedButton>
            }
          </>
        : ""
    );
}
