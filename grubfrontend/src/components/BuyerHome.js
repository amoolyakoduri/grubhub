import React from 'react';
import OrdersContainer from './OrdersContainer';
import JumbotronHome from './JumbotronHome';
import isBuyer from './isBuyer';
import RestoCard from './RestoCard';
import loginCheck from './LoginCheck'
import { connect } from 'react-redux';
import {
    onGetPastOrdersFailure, onGetUpcomingOrdersFailure,
    onGetUpcomingOrdersSuccess, onGetPastOrdersSuccess, onGetRestaurantsSuccess
} from './../actions/actions'
import ls from 'local-storage';
import DraggableOrders from './DraggableOrders';
import ReactPaginate from 'react-paginate';
import './../css/pagination.css';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'



class BuyerHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pastOrders: [],
            restaurants: [],
            upcomingOrders: [],
            offset: 0,
            data: [],
            elements: [],
            perPage: 5,
            currentPage: 0,
        }
    }

    setElementsForCurrentPage() {
        let elements = this.state.data
            .slice(this.state.offset, this.state.offset + this.state.perPage)
            .map(rest =>
                (<div><RestoCard details={rest} /><hr /></div>)
            );
        this.setState({ elements: elements });
    }

    componentDidMount() {
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/user/pastOrders/' + this.props.emailId, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${jwtToken}` },
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
        fetch('/api/user/getRestaurants', {
            method: 'GET',
            headers: { "Authorization": `Bearer ${jwtToken}` },
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            console.log("myJson is ", myJson)
            this.setState({
                data: myJson.payload,
                pageCount: Math.ceil(myJson.payload.length / this.state.perPage)
            }, () => this.setElementsForCurrentPage());
            this.props.getRestaurantsSuccessDispatch(myJson.payload);
        })
        fetch('/api/user/upcomingOrders/' + this.props.emailId, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${jwtToken}` },
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

    handlePageClick = (data) => {
        const selectedPage = data.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({ currentPage: selectedPage, offset: offset }, () => {
            this.setElementsForCurrentPage();
        });
    }

    render() {
        let paginationElement;
        if (this.state.pageCount > 1) {
            paginationElement = (
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={<span className="gap">...</span>}
                    pageCount={this.state.pageCount}
                    onPageChange={this.handlePageClick}
                    forcePage={this.state.currentPage}
                    containerClassName={"span"}
                    previousLinkClassName={"previous_page"}
                    nextLinkClassName={"next_page"}
                    activeClassName={"span.active"}
                />
            );
        }
        return <div style={{ textAlign: "center" }}>
            <JumbotronHome />
            {this.props.upcomingOrders &&
                <div>
                    <h4 class="container" >Your Upcoming Orders</h4>
                    <DndProvider backend={HTML5Backend}>
                        <DraggableOrders />
                    </DndProvider>
                </div>
            }
            {this.props.pastOrders &&
                <div >
                    <h4 class="container" style={{ textAlign: "center", color: "black" }}>Your Past Orders</h4>
                    <OrdersContainer orders={this.props.pastOrders} />
                </div>
            }
            {this.props.restaurants &&
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{paginationElement}</div>
                    <div style={{ border: "#d0dcdc", width: "fit-content", textAlign: "center", position: "absolute", left: "40%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        {this.state.elements}
                    </div >
                </div>
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    const { pastOrders, restaurants, upcomingOrders } = state.app;
    const emailId = state.app.emailId;
    return { pastOrders, restaurants, upcomingOrders, emailId };
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

export default connect(mapStateToProps, mapDispatchToProps)(loginCheck(isBuyer(BuyerHome)));