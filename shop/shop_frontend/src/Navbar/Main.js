import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavbarMain extends Component {
    handleLogout = event => {
        event.preventDefault();
        this.props.auth.userHasAuthenticated(false);
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="md">
                 <Navbar.Brand href="/">{"ЛКШ 2021"}</Navbar.Brand>
                 <Navbar.Toggle />

                 <Navbar.Collapse className="justify-content-end">
                    {this.props.auth.isAuthenticated
                        ? <Navbar.Text>
                            {"Привет, "}{this.props.auth.username}
                            {"! Баллов на счету: "}{this.props.auth.tokens}
                          </Navbar.Text>
                        : <div/>
                    }
                    <Nav>
                    {this.props.auth.isAuthenticated
                        ? <Nav.Link href="#" onClick={this.handleLogout}>{"Выйти"}</Nav.Link>
                        : <Nav.Link href="/login">{"Войти"}</Nav.Link>
                    }
                    </Nav>
                 </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavbarMain;
