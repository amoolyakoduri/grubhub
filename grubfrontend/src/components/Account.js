import React from 'react';
import { Nav, NavItem, NavLink, Button, ButtonGroup,
    Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import OrdersContainer from './OrdersContainer';
import {Link, Switch, Route} from 'react-router-dom';
import Profile from './Profile';
import loginCheck from './LoginCheck'

class Account extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div style = {{ height:"100%",display:"flex",flexDirection:"row"}}>
            <div>
            <Nav vertical style={{width:"300px", backgroundColor:"#fafafa"}}>
            <h4 className="filterTitle"> Your Account </h4>
            <NavItem>
          <Link to="/account/profile" >Profile</Link>
        </NavItem>
        <NavItem>
          <Link to="#">Address and Phone</Link>
        </NavItem>
        <NavItem>
          <Link to="#">Payments</Link>
        </NavItem>
        <NavItem>
          <Link to="#">Past Orders</Link>
        </NavItem>
        <NavItem>
          <Link to="#">Upcoming Orders</Link>
        </NavItem>
        </Nav>
        </div>
        <div style={{flexDirection:"column"}}>
        <Switch>
          <Route path="/account/profile">
            <Profile></Profile>
          </Route>
          <Route path="/account/orders">
            <OrdersContainer display="tuple" /> 
            </Route>
        </Switch>
        </div>
        </div>
    }
}

export default loginCheck(Account);