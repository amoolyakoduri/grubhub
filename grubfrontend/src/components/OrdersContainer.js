import React from 'react';
import OrderCard from './OrderCard';
import './../css/Orders.css'
import OrderTuple from './OrderTuple';
import { connect } from 'react-redux'


class OrdersContainer extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }



    render() {
        return this.props.orders ? (<div >
            <div style={{ display: "flex", flexDirection: "row" }}>
                {this.props.orders && this.props.orders.map(order => {
                    return <OrderCard  details={order}></OrderCard>
                        
                })}
            </div>
        </div>) : <h4>No Orders</h4>
    }

}



export default OrdersContainer;