import React from 'react';
import OrdersContainer from './OrdersContainer';
import JumbotronHome from './JumbotronHome';
import RestaurantContainer from './RestaurantContainer';
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck'
import { connect } from 'react-redux';
import { onGetPastOrdersFailure, onGetUpcomingOrdersFailure, onGetUpcomingOrdersSuccess, onGetPastOrdersSuccess, onGetRestaurantsSuccess } from './../actions/actions'
import ls from 'local-storage';
import DraggableOrders from './DraggableOrders';

import { DndProvider } from 'react-dnd'
	import HTML5Backend from 'react-dnd-html5-backend'
	


class BuyerHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pastOrders: [],
            restaurants: [],
            upcomingOrders: []
        }
    }

    componentDidMount() {
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/pastOrders/' + this.props.emailId, {
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`},
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false) {
                console.log("Couldnt fetch past orders");
                this.props.getPastOrdersFailureDispatch();
            } else {
                this.props.getPastOrdersSuccessDispatch(myJson.payload);
            }
        })
        fetch('/api/getRestaurants', {
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`},
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            console.log("myJson is ", myJson)
            this.props.getRestaurantsSuccessDispatch(myJson.payload);
        })
        fetch('/api/upcomingOrders/' + this.props.emailId, {
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`},
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false) {
                console.log("Couldnt fetch past orders");
                this.props.getUpcomingOrdersFailureDispatch();
            } else {
                this.props.getUpcomingOrdersSuccessDispatch(myJson.payload);
            }
        })
    }

    render() {
        return <div >
            <JumbotronHome />
            {this.props.upcomingOrders &&
            <div style = {{display:"flex",flexDirection:"column"}}>
            <h4 class="container" >Your Upcoming Orders</h4>

            <DndProvider backend={HTML5Backend}>				
                <DraggableOrders upcomingOrders={this.props.upcomingOrders} />
            </DndProvider>
            </div>
            }
            {this.props.pastOrders &&
            <div style = {{display:"flex",flexDirection:"column"}}>
            <h4 class="container"  style={{ textAlign: "center", color: "black" }}>Your Past Orders</h4>
                <OrdersContainer orders={this.props.pastOrders} display="card" />
                </div>
            }{this.props.restaurants &&
                <RestaurantContainer restaurants={this.props.restaurants} display="cards" />}
        </div>
    }
}

const mapStateToProps = (state) => {
    const { pastOrders, restaurants, upcomingOrders } = state.app;
    const emailId = state.app.emailId;
    return { pastOrders, restaurants, upcomingOrders , emailId};
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPastOrdersSuccessDispatch: (payload) => { dispatch(onGetPastOrdersSuccess(payload)) },
        getPastOrdersFailureDispatch: () => { dispatch(onGetPastOrdersFailure()) },
        getRestaurantsSuccessDispatch: (restaurants) => { dispatch(onGetRestaurantsSuccess(restaurants)) },
        getUpcomingOrdersSuccessDispatch: (payload) => { dispatch(onGetUpcomingOrdersSuccess(payload)) },
        getUpcomingOrdersFailureDispatch: () => { dispatch(onGetUpcomingOrdersFailure()) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyerHome)//(loginCheck(isBuyer(BuyerHome)));