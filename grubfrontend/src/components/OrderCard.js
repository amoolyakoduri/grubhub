import React from 'react';
import {
  Card, CardText, CardBody, CardImg,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import './../css/Order.css';
import pic from './../grub.png';
import { onGetRestDetailsSuccess, onGetRestDetailsFailure, onGetOrderItemsFailure, onGetOrderItemsSuccess } from './../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class OrderCard extends React.Component {
  constructor() {
    super();
  }

  repeatOrder = (event) => {
    event.preventDefault();
    fetch('http://localhost/getRestDetails/' + this.props.details.restId)
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        if (myJson.payload == null)
          this.props.getRestDetailsFailureDispatch();
        else
          this.props.getRestDetailsSuccessDispatch(myJson.payload);
      })
    fetch('http://localhost:3003/getOrderItems/' + this.props.details.id)
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        if (myJson.payload == null)
          this.props.getOrderItemsFailureDispatch();
        else {
          let payload = {
            restId: this.props.details.restId,
            items: myJson.payload
          }
          this.props.getOrderItemsSuccessDispatch(payload)
        }
      })
    this.props.history.push("/cart");
  }



  render() {
    console.log("in order");
    var details = this.props.details;
    return (<Card >
      <CardImg top width="100%" src={pic} alt="Card image cap" />
      <CardBody>
        <CardTitle>{details.restName}</CardTitle>
        <CardSubtitle>Amount: {details.amt}</CardSubtitle>
        <Button onClick={this.repeatOrder}>Repeat Order</Button>
      </CardBody>
    </Card>)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRestDetailsSuccessDispatch: (payload) => { dispatch(onGetRestDetailsSuccess(payload)) },
    getRestDetailsFailureDispatch: () => { dispatch(onGetRestDetailsFailure()) },
    getOrderItemsSuccessDispatch: (payload) => { dispatch(onGetOrderItemsSuccess(payload)) },
    getOrderItemsFailureDispatch: () => { dispatch(onGetOrderItemsFailure()) }
  }
}


export default connect(null, mapDispatchToProps)(withRouter(OrderCard));