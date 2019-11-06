import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { onDeleteOrderItemSuccess } from './../actions/actions';
import loginCheck from './LoginCheck';
import isBuyer from './isBuyer';


class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            cart: []
        }
    }

    checkout = (event) => {
        if (this.props.cart && this.props.cart && this.props.cart.length != 0) {
            this.setState({
                error: null
            })
            event.preventDefault();
            this.props.history.push("/checkout");
        } else {
            this.setState({
                error: "Add items to cart please."
            })
            return;
        }
    }

    delete = (itemId) => {
        this.props.deleteOrderItemSuccessDispatch({ itemId: itemId });
    }


    render() {
        let amt = 0;
        return <div >
            <h4 className="container">Your Order</h4>
            {
                this.props.cart &&
                this.props.cart.map(orderItem => {
                    amt = amt + orderItem.quantity * orderItem.price;
                    return <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div><h6>{orderItem.name}</h6></div>
                        <div><h6>{orderItem.quantity}pcs</h6></div>
                        <div><h6>{orderItem.quantity * orderItem.price}$</h6></div>
                        <div><Button onClick={() => { this.delete(orderItem.itemId) }} >Delete</Button></div>
                    </div>
                })
            }
            <hr />
            <h4 className="container">Items Total : {amt}$</h4>
            <div className="container" style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
                <Button onClick={this.checkout}>Proceed To Checkout</Button>
                {this.state.error && <div style={{ color: "red" }}>{this.state.error}</div>}
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    const { restDetails, cart } = state;
    return { restDetails, cart };
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteOrderItemSuccessDispatch: (payload) => { dispatch(onDeleteOrderItemSuccess(payload)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(loginCheck(isBuyer(Cart))));