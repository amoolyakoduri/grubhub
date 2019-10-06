import React from 'react';
import { Table, Button, Collapse, CardBody, Card, FormGroup, Input } from 'reactstrap';

import { onGetOrdersSuccess, onUpdateOrderFailure, onUpdateOrderSuccess, onGetOrdersFailure, onGetPastOrdersOwnerFailure, onGetPastOrdersOwnerSuccess } from './../actions/actions';
import { connect } from 'react-redux';
import isOwner from './isOwner';
import loginCheck from './LoginCheck';
import OrderItems from './OrderItems';

const orderStatus = [
    { name: "New", value: 1 },
    { name: "Preparing", value: 2 },
    { name: "Ready", value: 3 },
    { value: "4", name: "Delivered" },
    { name: "Cancelled", value: 5 }
]


class OwnerHome extends React.Component {

    constructor() {
        super();
        this.state = {
            ordres: []
        }
        this.menu = this.menu.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }
    menu(event) {
        event.preventDefault();
        this.props.history.push("/menu");
    }

    componentDidMount() {
        fetch('/api/getOrders/' + this.props.restId)
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                if (myJson.payload == null) {
                    this.props.getOrdersFailureDispatch();
                } else {
                    this.props.getOrdersSuccessDispatch(myJson.payload);
                }
            })
        fetch('/api/getPastOrders/' + this.props.restId)
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                if (myJson.payload == null) {
                    this.props.getPastOrdersOwnerFailureDispatch();
                } else {
                    this.props.getPastOrdersOwnerSuccessDispatch(myJson.payload);
                }
            })
    }

    changeHandler = (orderId, event) => {

        fetch('/api/updateOrder', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                restId: this.props.restId,
                orderId: orderId,
                status: event.target.value
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.payload == null)
                this.props.updateOrderFailureDispatch();
            else
                this.props.updateOrderSuccessDispatch(myJson.payload);
        })
    }

    render() {
        return <div className="container" style={{ display: "flex", flexDirection: "column" }}>
            <div>
                <Button onClick={this.menu}>Go To Menu</Button>
            </div>
            <h4>
                Current Orders:
            </h4>
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
                        this.props.orders &&
                        this.props.orders.map(order => {
                            return (<tr>
                                <td><Button color="white" onClick={this.toggle}>{order.id}</Button></td>
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>{order.amt}</td>
                                <td>
                                    <FormGroup>
                                        <Input type="select" onChange={(event) => this.changeHandler(order.id, event)} name="status" id="status">
                                            {
                                                orderStatus.slice(orderStatus.findIndex(s => s.name == order.status)).map(o => (<option value={o.value} selected={o.name === order.status}>{o.name}</option>))
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
            <h4>
                Past Orders:
            </h4>
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
                        this.props.pastOrders &&
                        this.props.pastOrders.map(order => {
                            return (<tr>
                                <td><Button color="white" onClick={this.toggle}>{order.id}</Button></td>
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>{order.amt}</td>
                                <td>
                                    <FormGroup>
                                        <Input type="select" onChange={(event) => this.changeHandler(order.id, event)} name="status" id="status">
                                            {
                                                orderStatus.slice(orderStatus.findIndex(s => s.name == order.status)).map(o => (<option value={o.value} selected={o.name === order.status}>{o.name}</option>))
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
        getPastOrdersOwnerSuccessDispatch: (payload) => { dispatch(onGetPastOrdersOwnerSuccess(payload)) }
    }
}

const mapStateToProps = (state) => {
    const restId = state && state.restDetails && state.restDetails.id;
    const { orders, pastOrders } = state;
    return { restId: restId, orders: orders, pastOrders };
}

export default connect(mapStateToProps, mapDispatchToProps)(loginCheck(isOwner(OwnerHome)));