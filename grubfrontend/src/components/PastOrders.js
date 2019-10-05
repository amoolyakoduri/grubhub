import React from 'react';
import {connect} from 'react-redux';
import OrdersContainer from './OrdersContainer';

class PastOrders extends React.Component {
    constructor(){
        super();
    }

    render(){
        return <div>
            {
                this.props.pastOrders ? 
                <OrdersContainer orders={this.props.pastOrders} display="tuple"/> : 
                <h4>No past orders yet</h4>
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    const {pastOrders} = state;
    return {pastOrders};
}

export default connect(mapStateToProps)(PastOrders);

