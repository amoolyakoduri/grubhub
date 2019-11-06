import React from 'react';
import { Table, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Chat from './Chat';
import {onCurrentOrderSuccess} from './../actions/actions';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

class OrderItems extends React.Component {

    constructor() {
        super()
    }

    goToChat = (details) => {
        this.props.getCurrentOrderSuccessDispatch(details);
        this.props.history.push({
          pathname: '/chat/',
        })
      }


    render() {
        let order = this.props.order;
        return <div className="container" style={{display:"flex",flexDirection:"column"}}>
            <h4>Order Details:</h4>
            <p>Order Id : {order._id}</p>
            <p>Name : {order.name}</p>
            <p>Delivery address : {order.address}</p>
            <p>Bill : {order.amt}</p>
            <p>Customer Email : {order.buyerEmail}</p>
            <p>Order Status : {order.status}</p>
            Order Items:
            <Table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.order_items.map(item => {
                            return <tr>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            <Button onClick={() => this.goToChat(order)}>Chat!</Button>
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      getCurrentOrderSuccessDispatch: (payload) => { dispatch(onCurrentOrderSuccess(payload))}
    }
  }

export default connect(null,mapDispatchToProps)(withRouter(OrderItems));