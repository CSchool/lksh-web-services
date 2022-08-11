import React from 'react';
import { Row, Col} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

function Game(props) {
    return (
        <>
            <Row className="mt-5">
                <Col xs={8}><a href={props.href}>
                    <h3>{props.title}</h3></a></Col>
            </Row>
            <Row>
                <Col>{props.children}</Col>
            </Row>
        </>
    );
}

export default function Menu(props) {
    return (
        <Container>
            <h2>{"Игры и всё такое"}</h2>
            <Game title="Быки и коровы" href="/bullcow">
                {"Компьютер загадывает пятизначное число, а человек пытается угадать его. "
                 + "Все цифры в числе разные. После каждой попытки компьютер даёт подсказку: "
                 + "число \"быков\" и число \"коров\". Быки - это цифры, стоящие на своём месте. "
                 + "Коровы - это правильные цифры, но на других местах. "
                 + "Нужно угадать число как можно быстрее."}
            </Game>
        </Container>
    );
}
