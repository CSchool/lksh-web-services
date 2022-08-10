import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


function NavLink(props) {
    if (!props.show)
        return <div />;
    return (
        <Nav.Item>
            <Nav.Link href={props.link} onClick={props.onClick}>
                {props.text}
            </Nav.Link>
        </Nav.Item>
    );
}

class NavbarMain extends Component {
    handleLogout = event => {
        event.preventDefault();
        this.props.auth.userRefresh(false);
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="md">
                 <Navbar.Brand href="/">{"ЛКШ " + new Date().getFullYear()}</Navbar.Brand>
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
                        <NavLink link="/shop" text="Магазин" show />
                        <NavLink link="/users" text="Пользователи"
                            show={this.props.auth.is_staff} />
                        <NavLink link="/givetokens" text="Выдать баллы"
                            show={this.props.auth.is_staff} />
                        <NavLink link="/giveaway" text="Выдать призы"
                            show={this.props.auth.is_staff} />
                        <NavLink link="/prizes"
                            text={this.props.auth.is_staff ? "Выданные призы" : "Мои призы"}
                            show={this.props.auth.isAuthenticated} />
                        <NavLink link="#" text="Выйти"
                            show={this.props.auth.isAuthenticated}
                            onClick={this.handleLogout} />
                        <NavLink link="/login" text="Войти"
                            show={!this.props.auth.isAuthenticated} />
                    </Nav>
                 </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavbarMain;
