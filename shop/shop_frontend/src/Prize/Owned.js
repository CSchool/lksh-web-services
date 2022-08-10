import React from 'react';
import ItemList from './ItemList';

export default function Owned(props) {
    return (
        <ItemList auth={props.auth} showTaken
            user={props.user}/>
    );
}
