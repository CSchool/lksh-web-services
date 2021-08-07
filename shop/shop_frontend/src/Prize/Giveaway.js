import React from 'react';
import ItemList from './ItemList';

export default function Giveaway(props) {
    return (
        <ItemList auth={props.auth} giveButton undoButton/>
    );
}
