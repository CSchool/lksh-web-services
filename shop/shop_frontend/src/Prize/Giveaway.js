import { BackendURL, fetchBackend } from '../Backend/Backend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import ItemList from './ItemList';

export default function Giveaway(props) {
    return (
        <ItemList auth={props.auth}
                actionText="Отдать"
                actionUrl="give/"
        />
    );
}
