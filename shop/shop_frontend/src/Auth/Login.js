import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { postBackend } from '../Backend/Backend'
import Container from 'react-bootstrap/Container';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null,
      login: "",
      password: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit(event);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    postBackend('auth/login/', {},
        { username:this.state.login, password:this.state.password },
        response => {
            if (response.key) {
                this.props.auth.userRefresh(true);
                this.props.history.push("/");
            } else {
                this.setState({alert:'Login error'});
            }
        })
        .catch(e => this.setState({alert:'Invalid login/password'}));
  }

  render() {
    return (
      <Container>
        <Row>
            <h1>Вход в учётную запись</h1>
        </Row>
        { this.state.alert
          && <Row>
               <Col>
                 <Alert variant="danger">
                   {this.state.alert}
                 </Alert>
               </Col>
             </Row>
        }
        <form>
          <div className="form-group row">
            <label className="col-2 control-label" htmlFor="login">
              Имя
            </label>
            <div className="col-10">
              <input className="form-control" name="login" id="login"
                     value={this.state.login}
                     onChange={this.handleChange}
                     required />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-2 control-label" htmlFor="password">Пароль</label>
            <div className="col-10">
              <input className="form-control" type="password"
                     value={this.state.password}
                     onChange={this.handleChange}
                     onKeyUp={this.handleKeyUp}
                     name="password" id="password" required />
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-2 col-10">
              <Button variant="primary" onClick={this.handleSubmit}>
                Войти
              </Button>
            </div>
          </div>
        </form>
      </Container>
    );
  }
}

export default Login
