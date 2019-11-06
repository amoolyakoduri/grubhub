import React from 'react';
import { Table, Button, Collapse, CardBody, Card, FormGroup, Input } from 'reactstrap';

import { onGetOrdersSuccess, onGetOwnerRestDetailsFailure, onGetOwnerRestDetailsSuccess, onUpdateOrderFailure, onUpdateOrderSuccess, onGetOrdersFailure, onGetPastOrdersOwnerFailure, onGetPastOrdersOwnerSuccess } from './../actions/actions';
import { connect } from 'react-redux';
import isOwner from './isOwner';
import loginCheck from './LoginCheck';
import OrderItems from './OrderItems';
import ls from 'local-storage';


const orderStatus = [
    { name: "New"},
    { name: "Preparing"},
    { name: "Ready"},
    { name: "Delivered" },
    { name: "Cancelled"}
]


class OwnerHome extends React.Component {

    constructor() {
        super();
        this.state = {
            status : "",

        }
        this.menu = this.menu.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }
    menu(event) {
        event.preventDefault();
        this.props.history.push("/menu");
    }

    componentDidMount() {
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/getRestDetails/'+this.props.emailId,{
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`}
        })
        .then( (response) => {
            return response.json();
        }).then( (myJson) => {
            if(myJson.success==false){
                this.props.getOwnerRestDetailsFailureDispatch();
            } else {
                this.props.getOwnerRestDetailsSuccessDispatch(myJson.payload[0]);
            }
        }).then(() => {
        fetch('/api/getOrders/' + this.props.restDetails.name,{
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`}})
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                if (myJson.success == false) {
                    this.props.getOrdersFailureDispatch();
                } else {
                    this.props.getOrdersSuccessDispatch(myJson.payload);
                }
            })
        }).then( () => {
        fetch('/api/getPastOrders/' + this.props.restDetails.name,{
            method: 'GET',
            headers: {"Authorization" : `Bearer ${jwtToken}`}})
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                if (myJson.success == false) {
                    this.props.getPastOrdersOwnerFailureDispatch();
                } else {
                    this.props.getPastOrdersOwnerSuccessDispatch(myJson.payload);
                }
            })})
    }

    changeHandler = (orderId, event) => {
        var jwtToken = ls.get('jwtToken').substring(3);
        var status = event.target.value;
        this.setState( {status:event.target.value }) 
            fetch('/api/updateOrder', {
            headers: {
                "Authorization" : `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                orderId: orderId,
                status: event.target.value
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false)
                this.props.updateOrderFailureDispatch();
            else {
                var payload = { orderId , status :status}
                this.props.updateOrderSuccessDispatch(payload);
            }
        }).catch( (err) => {
            console.log(err.message)
        })
    }

    render() {
        return <div className="container" style={{ display: "flex", flexDirection: "column" }}>
            <div>
                <Button onClick={this.menu}>Go To Menu</Button>
            </div>
            <h4>
                Current Orders:
            </h4>{
                        this.props.orders &&  
            <Table>
                <thead>
                    <tr>
                        <th>OrderId</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Bill</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.orders.map(order => {
                            return (<tr>
                                <td><Button color="white" onClick={this.toggle}>{order._id}</Button></td>
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>{order.amt}</td>
                                <td>
                                    <FormGroup>
                                        <Input type="select" onChange={(event) => this.changeHandler(order._id, event)} name="status" id="status">
                                            {
                                                orderStatus.slice(orderStatus.findIndex(s => s.name == order.status)).map(o => 
                                                    (<option value={o.name} name= {o.name} selected={order.status}>{o.name}</option>)
                                                )
                                            }
                                        </Input>
                                        
                                    </FormGroup>
                                </td>
                                <Collapse isOpen={this.state.collapse}>
                                    <OrderItems order={order} />
                                </Collapse>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
                        }
            <h4>
                Past Orders:
            </h4>
            {this.props.pastOrders &&
            <Table>
                <thead>
                    <tr>
                        <th>OrderId</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Bill</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.pastOrders.map(order => {
                            return (<tr>
                                <td><Button color="white" onClick={this.toggle}>{order._id}</Button></td>
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>{order.amt}</td>
                                <td>
                                    {order.status}
                                </td>
                                <Collapse isOpen={this.state.collapse}>
                                    <OrderItems order={order} />
                                </Collapse>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
            }
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getOrdersSuccessDispatch: (payload) => { dispatch(onGetOrdersSuccess(payload)) },
        getOrdersFailureDispatch: () => { dispatch(onGetOrdersFailure()) },
        updateOrderSuccessDispatch: (payload) => { dispatch(onUpdateOrderSuccess(payload)) },
        updateOrderFailureDispatch: () => { dispatch(onUpdateOrderFailure()) },
        getPastOrdersOwnerFailureDispatch: () => { dispatch(onGetPastOrdersOwnerFailure()) },
        getPastOrdersOwnerSuccessDispatch: (payload) => { dispatch(onGetPastOrdersOwnerSuccess(payload))},
        getOwnerRestDetailsSuccessDispatch : (payload) => { dispatch(onGetOwnerRestDetailsSuccess(payload))},
        getOwnerRestDetailsFailureDispatch : () => { dispatch(onGetOwnerRestDetailsFailure())}
    }
}

const mapStateToProps = (state) => {
    const { orders, pastOrders,emailId } = state.app;
    const { restDetails } = state;
    return { restDetails, orders, pastOrders,emailId };
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerHome)//(loginCheck(isOwner(OwnerHome)));