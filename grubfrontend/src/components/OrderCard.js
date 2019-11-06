import React from 'react';
import {
  Card, CardText, CardBody, CardImg,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import './../css/Order.css';
import { onGetRestDetailsSuccess, onGetRestDetailsFailure, onGetOrderItemsFailure, onGetOrderItemsSuccess, onCurrentOrderSuccess } from './../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../css/OrderCard.css'
import ls from 'local-storage';


class OrderCard extends React.Component {
  constructor() {
    super();
  }

  goToChat = (details) => {
    this.props.getCurrentOrderSuccessDispatch(details);
    this.props.history.push({
      pathname: '/chat/',
    })
  }

  repeatOrder = (event) => {
    event.preventDefault();
    var jwtToken = ls.get('jwtToken').substring(3);
    fetch('/api/user/getRestDetailsByRestName/' + this.props.details.restName,{
      method: 'GET',
      headers: {"Authorization" : `Bearer ${jwtToken}`}})
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        if (myJson.success == false)
          this.props.getRestDetailsFailureDispatch();
        else 
          this.props.getRestDetailsSuccessDispatch(myJson.payload);
          this.props.getOrderItemsSuccessDispatch(this.props.details.order_items)

      })
    this.props.history.push("/cart");
  }



  render() {
    var details = this.props.details;
    return (<Card >
      <CardImg style={{width: '250px'}}  src={'/'+details.restPic} alt="Card image cap" />
      <CardBody>
        <CardTitle>{details.restName}</CardTitle>
        <CardSubtitle>Amount: {details.amt}</CardSubtitle>
        Order Status : {details.status}
        <Button onClick={this.repeatOrder}>Repeat Order</Button>
        <Button onClick={()=>{this.goToChat(details)}}>Chat!</Button>
      </CardBody>
    </Card>)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRestDetailsSuccessDispatch: (payload) => { dispatch(onGetRestDetailsSuccess(payload)) },
    getRestDetailsFailureDispatch: () => { dispatch(onGetRestDetailsFailure()) },
    getOrderItemsSuccessDispatch: (payload) => { dispatch(onGetOrderItemsSuccess(payload)) },
    getOrderItemsFailureDispatch: () => { dispatch(onGetOrderItemsFailure()) },
    getCurrentOrderSuccessDispatch: (payload) => { dispatch(onCurrentOrderSuccess(payload))}
  }
}


export default connect(null, mapDispatchToProps)(withRouter(OrderCard));