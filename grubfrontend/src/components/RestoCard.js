import React from 'react';
import {
  Card, CardText, CardBody, CardImg,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { onCurrentRestDetailsSuccess } from './../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


class RestoCard extends React.Component {

  constructor(props) {
    super(props);
    this.placeOrder = this.placeOrder.bind(this);
  }

  placeOrder(event) {
    event.preventDefault();
    this.props.currentRestDetailsSuccessDispatch(this.props.details);
    this.props.history.push("/placeOrder");
  }

  render() {
    var details = this.props.details;
    return <Card>
      <CardImg style={{ width: "250px" }} src={'/' + details.displayPic} alt="Card image cap" />
      <CardBody>
        <CardTitle>{details.name}</CardTitle>
        <CardSubtitle>{details.cuisine}</CardSubtitle>
        <CardText>{details.address}</CardText>
        <Button onClick={this.placeOrder}>Order!</Button>
      </CardBody>
    </Card>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    currentRestDetailsSuccessDispatch: (payload) => { dispatch(onCurrentRestDetailsSuccess(payload)) }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(RestoCard));