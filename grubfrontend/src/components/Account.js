import React from 'react';
import {
  Nav, NavItem, NavLink, Button, ButtonGroup,
  Modal, ModalHeader, ModalBody, ModalFooter, Input
} from 'reactstrap';
import OrdersContainer from './OrdersContainer';
import { Link, Switch, Route } from 'react-router-dom';
import Profile from './Profile';
import { connect } from 'react-redux';
import loginCheck from './LoginCheck'
import { onGetPastOrdersFailure, onGetUpcomingOrdersFailure, onGetUpcomingOrdersSuccess, onGetPastOrdersSuccess } from './../actions/actions'


class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      pastOrders: [],
      upcomingOrders: []
  }
  }
  componentDidMount() {
    if(!this.props.pastOrders) {
    fetch('http://localhost:3003/pastOrders/' + this.props.emailId, {
            method: 'GET'
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.payload == null) {
                console.log("Couldnt fetch past orders");
                this.props.getPastOrdersFailureDispatch();
            } else {
                this.props.getPastOrdersSuccessDispatch(myJson.payload);
            }
        })
      }
    if(!this.props.upcomingOrders) {
      fetch('http://localhost:3003/upcomingOrders/' + this.props.emailId, {
            method: 'GET'
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.payload == null) {
                console.log("Couldnt fetch past orders");
                this.props.getUpcomingOrdersFailureDispatch();
            } else {
                this.props.getUpcomingOrdersSuccessDispatch(myJson.payload);
            }
        })
    }
  }

  render() {
    return <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
      <div>
        <Nav vertical style={{ width: "300px", backgroundColor: "#fafafa" }}>
          <h4 className="filterTitle"> Your Account </h4>
          <NavItem>
            <Link to="/account/profile" >Profile</Link>
          </NavItem>
          {this.props.type === 'buyer' && <NavItem>
            <Link to="/account/pastOrders">Past Orders</Link>
          </NavItem>}
          {this.props.type === 'buyer' && <NavItem>
            <Link to="/account/upcomingOrders">Upcoming Orders</Link>
          </NavItem>}
        </Nav>
      </div>
      <div style={{ flexDirection: "column" }}>
        <Switch>
          <Route path="/account/profile">
            <Profile></Profile>
          </Route>
          <Route path="/account/pastOrders">
            <OrdersContainer orders={this.props.pastOrders} display="tuple" />
          </Route>
          <Route path="/account/upcomingOrders">
            <OrdersContainer orders={this.props.upcomingOrders} display="tuple" />
          </Route>
        </Switch>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => {
  const { pastOrders, upcomingOrders, type } = state;
  return { pastOrders, upcomingOrders, type };
}

const mapDispatchToProps = (dispatch) => {
  return {
      getPastOrdersSuccessDispatch: (payload) => { dispatch(onGetPastOrdersSuccess(payload)) },
      getPastOrdersFailureDispatch: () => { dispatch(onGetPastOrdersFailure()) },
      getUpcomingOrdersSuccessDispatch: (payload) => { dispatch(onGetUpcomingOrdersSuccess(payload)) },
      getUpcomingOrdersFailureDispatch: () => { dispatch(onGetUpcomingOrdersFailure()) },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(loginCheck(Account));