import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import PausedButton from '../Controls/PausedButton';

export default function BullCow(props) {
    const [tries, setTries] = useState([]);
    const [secret, setSecret] = useState("");
    const [guess, setGuess] = useState("");

    var valid = guess.length === 5;
    if (valid) {
        var i;
        for (i = 0 ; i < 5 ; ++i) {
            if (guess[i] < '0' || guess[i] > '9')
                valid = false;
            for (var j = 0 ; j < i ; ++j)
                if (guess[i] === guess[j])
                    valid = false;
        }
        for (i = 0 ; i < tries.length ; ++i) {
            if (tries[i].guess === guess)
                valid = false;
        }
    }

    const addGuess = () => {
        var b = 0;
        var c = 0;
        for (var i = 0 ; i < 5 ; ++i) {
            const d = guess[i];
            if (d === secret[i]) {
                ++b;
            } else if (secret.indexOf(d) >= 0) {
                ++c;
            }
        }
        setTries([...tries, {guess:guess, bull:b, cow:c}]);
        setGuess("");
    };

    useEffect(() => {
        var x = "";
        while (x.length < 5) {
            var d = "" + Math.floor(Math.random() * 10);
            if (x.length === 0 && d === "0") {
                continue;
            }
            if (x.indexOf(d) >= 0) {
                continue;
            }
            x = x + d;
        }
        setSecret(x);
        // eslint-disable-next-line
    }, []);

    var finished = tries.length > 0 && secret === tries[tries.length - 1].guess;

    return (
        <>
            <h2>{"Быки и коровы"}</h2>
            {/* <Row className="align-items-center"><Col> */}
            <h4>
            {finished
                ? <>{"Вы угадали, моё число "}{secret}</>
                : <>{"Я загадал число, угадайте его."}</>
            }
            </h4>
            {/* </Col></Row> */}
            <Row className="align-items-center">
                <Col xs={2}>{"Ваша попытка"}</Col>
                <Col xs={2}>
                <Form.Control type="number" id="guess"
                        onChange={e => setGuess(e.target.value)}
                        value={guess}/>
                </Col>
                <Col xs={1}>
                    <PausedButton onClick={addGuess} pause={1} confirm={false}
                            disabled={!valid}>
                        Угадать!
                    </PausedButton>
                </Col>
            </Row>
            {tries.map(t => {
                    return <Row key={t.guess}>
                        <Col xs={2}>{"Попытка: "}<b>{t.guess}</b></Col>
                        <Col xs={2}>{" Быки: "}<b>{t.bull}</b></Col>
                        <Col xs={2}>{" Коровы: "}<b>{t.cow}</b></Col>
                    </Row>;
                })
            }
        </>
    );
}
