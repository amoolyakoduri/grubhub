import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import pic from './../grub.png'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { onLogoutSuccess } from '../actions/actions';

class CustomNavbar extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
    }
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  login(e) {
    e.preventDefault();
    window.location.href = '/login'
  }

  signUp(e) {
    e.preventDefault();
    window.location.href = "/signUp"
  }

  logout() {
    fetch('/logout')
      .then(res => res.json())
      .then(res => {
        this.props.logoutSuccessDispatch();
        this.props.history.push('/login');
      })

    // window.location.href="/login"
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    console.log("in navbar");
    let nav = null;
    if (this.props.isLoggedIn)
      nav = (<div style={{ display: "flex", flexDirection: "row" }}>
        <NavItem>
          <Link style={{ color: "#606369" }} to={this.props.type === "buyer" ? "/lets-eat" : "/home"}>Home</Link>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Hi, {this.props.firstName}!
      </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem divider />
            <DropdownItem>
              <Link style={{ color: "#606369" }} to="/account" >Account</Link>
            </DropdownItem>
            <DropdownItem>
              <Button onClick={this.logout} >Log out!</Button>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <NavItem>
          <Link style={{ color: "#606369" }} to="/cart">Cart</Link>
        </NavItem></div>)
    else
      nav = <div><Button onClick={this.login}>Login</Button> <Button onClick={this.signUp}>SignUp</Button>
      </div>

    return (
      <div>
        <Navbar color="light" light expand="md">
          <Link to="/lets-eat"><img style={{ height: "50px", width: "85px" }} src={pic} /></Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/Home"></NavLink>
              </NavItem>
              {nav}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const isLoggedIn = state.isLoggedIn;
  const type = state.type;
  const firstName = state.firstName;
  return { isLoggedIn, type, firstName };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutSuccessDispatch: () => { dispatch(onLogoutSuccess()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomNavbar);