import React from 'react';
import './../css/QuantityBox.css';

class QuantityBox extends React.Component {
  constructor() {
    super();
    this.state = {
      quantity: 1
    }
  }

  getInitialState = () => {
    return { quantity: 1 };
  }

  onDecrement = () => {
    if (this.state.quantity <= 1) return;
    this.setState({ quantity: --this.state.quantity });
    this.props.getQuantity(this.state.quantity);
  }

  onIncrement = () => {
    this.setState({ quantity: ++this.state.quantity });
    this.props.getQuantity(this.state.quantity);
  }

  render() {
    return (
      <div className="qty-box" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        <div className="dec box" onClick={this.onDecrement} onTouchStart={this.onDecrement}>–</div>
        <div className="qty box">{this.state.quantity}</div>
        <div className="inc box" onClick={this.onIncrement} onTouchStart={this.onIncrement}>+</div>
      </div>
    );
  }
}

export default QuantityBox;