import React from 'react';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import QuantityBox from './QuantityBox';
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck';

class ItemDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      quantity: 1
    };
  }
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      quantity: 1
    }));
  }

  getQuantity = (val) => {
    this.state.quantity = val;
    console.log("this.state.quantity is ", this.state.quantity)
  }

  render() {
    let details = this.props.details;
    return <div>
      <Card>
        <CardBody>
          <CardTitle>{details.name}</CardTitle>
          <CardSubtitle>{details.price}$</CardSubtitle>
          <CardText>{details.descr}</CardText>
          <Button onClick={this.toggle}>Add Item To Cart</Button>
        </CardBody>
      </Card>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{details.name} - {details.price}$</ModalHeader>
        <ModalBody>
          <p>{details.descr}</p>
          <h5>Quantity:</h5>
          <QuantityBox getQuantity={this.getQuantity} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { this.props.addToCart(details.id, this.state.quantity, details.price, details.name); this.toggle(); }}>Add to Cart</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  }
}

export default loginCheck(isBuyer(ItemDetails));