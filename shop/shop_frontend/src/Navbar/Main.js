import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavbarMain extends Component {
    handleLogout = event => {
        event.preventDefault();
        this.props.auth.userRefresh(false);
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
                        <Nav.Link href="/">{"Магазин"}</Nav.Link>
                    {this.props.auth.is_staff
                        ? <>
                            <Nav.Link href="/">{"Выдать баллы"}</Nav.Link>
                            <Nav.Link href="/giveaway">{"Выдать призы"}</Nav.Link>
                         </>
                        : <div />
                    }
                    {this.props.auth.isAuthenticated
                        ? <>
                            <Nav.Link href="/prizes">{"Мои призы"}</Nav.Link>
                            <Nav.Link href="#" onClick={this.handleLogout}>{"Выйти"}</Nav.Link>
                          </>
                        : <Nav.Link href="/login">{"Войти"}</Nav.Link>
                    }
                    </Nav>
                 </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavbarMain;
