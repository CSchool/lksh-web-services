import React from 'react';
import ItemList from './ItemList';

export default function OwnPrizes(props) {
    return (
        <ItemList auth={props.auth} showTaken
            user={props.auth.is_staff ? null : props.user}/>
    );
}
