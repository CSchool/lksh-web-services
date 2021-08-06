import React, { Component } from 'react';
import { fetchBackend, postBackend } from '../Backend/Backend';
import PausedButton from '../Controls/PausedButton';
import Container from 'react-bootstrap/Container';
import { Row, Col, ListGroup} from 'react-bootstrap';
import Form from 'react-bootstrap/Form'

export default class Givetokens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups:[],
            users:[],
            user:0,
            group:0,
            username:"",
            tokens: 0,
        };
    }

    handleTokensChange = (event) => {
        var v = event.target.value;
        if (/^[0-9]+$/.test(v))
            v = Number(v);
        else
            v = '';
        this.setState({tokens: v});
    }

    handleSend = () => {
        postBackend("pay/", {}, {user:this.state.user, tokens:this.state.tokens},
            () => {
                this.setState({tokens:0});
                this.props.auth.userRefresh(true);
            });
    }

    handleUpdate = () => {
        var filter = {}
        if (this.state.group)
            filter = {group:this.state.group}
        fetchBackend('groups/', {},
            data => {
                this.setState({ groups: data });
            }
        );
        fetchBackend('users/', filter,
            data => {
                console.log(data);
                this.setState({ users: data });
            }
        );
    };

    componentDidMount() {
        this.handleUpdate();
    }

    render() {
        return (
            <Container>
                <h2>{"Выдать баллы"}</h2>
                <h3>{"Группа"}</h3>
                <ListGroup>
                    <ListGroup.Item key={0}
                            active={this.state.group===0}
                            onClick={() => {
                                this.setState({group:0, user:0, username:''},
                                    this.handleUpdate);
                            }}>
                        {"Все группы"}
                    </ListGroup.Item>
                {this.state.groups.map(group =>
                    <ListGroup.Item key={group.id}
                        active={this.state.group===group.id}
                        onClick={() => {
                            this.setState({group:group.id, user:0, username:''},
                                this.handleUpdate);
                        }}>
                        {group.name}
                    </ListGroup.Item>
                )}
                </ListGroup>
                <h3>{"Ученик"}</h3>
                <ListGroup>
                {this.state.users.map(user =>
                    <ListGroup.Item key={user.pk}
                        active={this.state.user===user.pk}
                        onClick={() => this.setState({user:user.pk, username:user.full_name})}>
                        {user.full_name}
                    </ListGroup.Item>
                )}
                </ListGroup>
                {this.state.user
                    ? <Row className="align-items-center">
                        <Col xs="auto" className="align-items-center">
                            {"Пользователю " + this.state.username + " перевести "}
                        </Col>
                        <Col xs="auto">
                            <Form.Control type="number"
                                value={this.state.tokens}
                                onChange={this.handleTokensChange}/>
                        </Col>
                        <Col xs="auto">
                            <PausedButton pause={2}
                                disabled={
                                    !this.state.user
                                    || this.state.tokens <= 0
                                    || this.state.tokens > this.props.auth.tokens}
                                onClick={this.handleSend}>
                                {"OK"}
                            </PausedButton>
                        </Col>
                     </Row>
                    : ""
                }
            </Container>
        );
    }
}
