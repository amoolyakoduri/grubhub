import React from 'react';
import { Table, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class OrderItems extends React.Component {

    constructor() {
        super()
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

        </div>
    }
}

export default OrderItems;