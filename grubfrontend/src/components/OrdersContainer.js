import React from 'react';
import OrderCard from './OrderCard';
import './../css/Orders.css'
import OrderTuple from './OrderTuple';
import { connect } from 'react-redux'


class OrdersContainer extends React.Component{
    constructor() {
        super();
        this.state = {
        }
    }

    

    render() {
        return this.props.orders  ? (<div >
        <div >
            {this.props.orders && this.props.orders.map(order => {
                return this.props.display==="tuple" ? 
                <OrderTuple details={order} /> :
                <OrderCard details = {order}></OrderCard>
            })}  
      </div>
        </div>) : null
    }

}



export default OrdersContainer;