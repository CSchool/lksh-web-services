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
            tokens: {},
        };
    }

    handleTokensChange = (event, user) => {
        var v = event.target.value;
        if (/^[0-9]+$/.test(v))
            v = Number(v);
        else
            v = '';
        var tokens = this.state.tokens;
        tokens[user] = v;
        this.setState({tokens: tokens});
    }

    handleSend = () => {
        postBackend("pay/", {}, {tokens:this.state.tokens},
            () => {
                this.handleUpdate();
                this.props.auth.userRefresh(true);
            });
    }

    handleUpdate = () => {
        var filter = {}
        if (this.state.group)
            filter = {group:this.state.group}
        fetchBackend('groups/', {},
            data => {
                this.setState({ groups: data },
                    () => fetchBackend('users/', filter,
                        data => {
                            this.setState({ users: data, tokens: {}, user: 0 });
                        }
                    )
                );
            }
        );
    };

    componentDidMount() {
        this.handleUpdate();
    }

    getsum = () => {
        var sum = 0;
        for(var key in this.state.tokens) {
            var v = this.state.tokens[key];
            if (/^[0-9]+$/.test(v))
                v = Number(v);
            else
                v = 0;
            sum += v;
        }
        return sum;
    }

    render() {
        var sum = this.getsum();
        return (
            <Container>
                <h2>{"Выдать баллы"}</h2>
                <h3>{"Группа"}</h3>
                <ListGroup>
                    <ListGroup.Item key={0}
                            active={this.state.group===0}
                            onClick={() => {
                                this.setState({group:0, user:0, username:'', tokens:{}},
                                    this.handleUpdate);
                            }}>
                        {"Все группы"}
                    </ListGroup.Item>
                {this.state.groups.map(group =>
                    <ListGroup.Item key={group.id}
                        active={this.state.group===group.id}
                        onClick={() => {
                            this.setState({group:group.id, user:0, username:'', tokens:{}},
                                this.handleUpdate);
                        }}>
                        {group.name}
                    </ListGroup.Item>
                )}
                </ListGroup>
                <h3>{"Ученики"}</h3>
                <ListGroup>
                {this.state.users.map(user =>
                    <ListGroup.Item key={user.pk}
                        active={this.state.user===user.pk}
                        onClick={() => this.setState({user:user.pk, username:user.full_name})}>
                        <Row>
                            <Col>{user.full_name + ' (' + user.profile.tokens + ')'}
                            <span className="text-danger">{user.today_tokens ? " +" + user.today_tokens : ""}</span>
                            </Col>
                            <Col><Form.Control type="number"
                                value={this.state.tokens[user.pk] ? this.state.tokens[user.pk] : ''}
                                onChange={(event) => this.handleTokensChange(event, user.pk)}/>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )}
                </ListGroup>
                <Row className="align-items-center">
                    <Col xs="auto" className="align-items-center">
                        {"Раздать "}
                        { sum }
                        {" баллов"}
                    </Col>
                    <Col xs="auto">
                        <PausedButton pause={2}
                            disabled={
                                sum <= 0
                                || sum > this.props.auth.tokens}
                            onClick={this.handleSend}>
                            {"OK"}
                        </PausedButton>
                    </Col>
                </Row>
            </Container>
        );
    }
}
