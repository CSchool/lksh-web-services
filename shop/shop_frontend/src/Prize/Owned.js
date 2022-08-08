import React from 'react';
import ItemList from './ItemList';

export default function OwnPrizes(props) {
    return (
        <ItemList auth={props.auth} user={props.user} showTaken/>
    );
}
