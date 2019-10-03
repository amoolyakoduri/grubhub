import React from 'react';
import { Table, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import { onGetOrdersSuccess,onUpdateOrderFailure, onUpdateOrderSuccess, onGetOrdersFailure } from './../actions/actions';
import {connect} from 'react-redux';
import isOwner from './isOwner';
import loginCheck from './LoginCheck';

const orderStatus = [
    {name:"New", value: 1}, 
    {name: "Prepared",value:2 }, 
    {name:"Ready", value: 3},
    {value:"4", name:"Delivered"},
    {name:"Cancelled", value: 5}
]


class OwnerHome extends React.Component {

    constructor() {
        super();
        this.menu = this.menu.bind(this);
    }

    menu(event){
        event.preventDefault();
        this.props.history.push("/menu");
    }

    componentDidMount() {
        fetch('http://localhost:3003/getOrders/'+this.props.restId)
        .then( (response) => {
            return response.json();
        }).then( (myJson) => {
            if(myJson.payload==null){
                this.props.getOrdersFailureDispatch();
            } else {
                this.props.getOrdersSuccessDispatch(myJson.payload);
            }
        })
    }

    changeHandler = (orderId,event) => {

        fetch('http://localhost:3003/updateOrder',{
            headers: {
                'Content-Type': 'application/json'
              },
              method : 'POST',
              body : JSON.stringify({ 
                restId : this.props.restId,
                orderId : orderId,
                status : event.target.value})
        }).then( (response) => {
            return response.json();
        }).then( (myJson) => {
            if(myJson.payload==null)
                this.props.updateOrderFailureDispatch();
            else
                this.props.updateOrderSuccessDispatch(myJson.payload);
        })
    }

    render() {
        return <div className="container" style={{display:"flex",flexDirection:"column"}}>
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
                this.props.orders.map( order => {
                    return (<tr>
                        <td>{order.id}</td>
                        <td>{order.name}</td>
                        <td>{order.address}</td>
                        <td>{order.amt}</td>
                        <td>
                            <FormGroup>
                            <Input type="select" onChange={(event) => this.changeHandler(order.id,event)} name="status" id="status">
                                {/* <option value="1">New</option>
                                <option value="2">Preparing</option>
                                <option value="3">Ready</option>
                                <option value="4">Delivered</option>
                                <option value="5">Cancelled</option> */}
                                {
                                    orderStatus.map(o => (<option value={o.value} selected={o.name===order.status}>{o.name}</option>))
                                }
                            </Input>
                            </FormGroup>
                        </td>
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
        getOrdersSuccessDispatch : (payload) => { dispatch(onGetOrdersSuccess(payload))},
        getOrdersFailureDispatch : () => { dispatch(onGetOrdersFailure())},
        updateOrderSuccessDispatch : (payload) => { dispatch(onUpdateOrderSuccess(payload))},
        updateOrderFailureDispatch : () => { dispatch(onUpdateOrderFailure())}
    }
}

const mapStateToProps = (state) => {
    const restId = state && state.restDetails && state.restDetails.id;
    const {orders} = state;
    return {restId:restId,orders:orders};
} 

export default connect(mapStateToProps,mapDispatchToProps)(loginCheck(isOwner(OwnerHome)));