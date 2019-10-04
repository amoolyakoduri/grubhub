import React from 'react';
import {connect} from 'react-redux';
import {Button,Input} from 'reactstrap';
import {onGetDeliveryDetailsSuccess} from './../actions/actions';
import loginCheck from './LoginCheck'
import Cart from './Cart';
import isBuyer from './isBuyer';


class Checkout extends React.Component {
    constructor() {
        super();
        this.state = {
            user : {},
            deliveryDetails: {}
        }

    }

    componentDidMount() {
        let payload = {
            firstName : this.props.user.firstName,
            lastName : this.props.user.lastName,
            phone : this.props.user.phone,
            address : this.props.user.address,
            instructions : "e.g. Check in with doorman"
        }
        this.setState({deliveryDetails:payload})
        this.props.getDeliveryDetailsSuccessDispatch(payload);
    }

    changeHandler = (event) =>  {
        console.log(event.target.value);
        let key = event.target.name;
        let value = event.target.value;
        console.log("key is ",key);
        this.setState(state => { 
            return Object.assign({}, state, { deliveryDetails: Object.assign({},state.deliveryDetails,{ [key] : value})})
        });
    }

    getDateString = () => {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ]
        var date = new Date();
        var dateString = monthNames[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        return dateString;
    }

    placeOrder = () => {
        let dateString = this.getDateString();
        this.props.getDeliveryDetailsSuccessDispatch(this.state.deliveryDetails,dateString);
        fetch('http://localhost:3003/placeOrder',{
            headers: {
              'Content-Type': 'application/json'
            },
            method : 'POST',
            body : JSON.stringify({
                emailId : this.props.user.emailId,
                restId : this.props.cart.restId,
                orderItems : this.props.cart.items,
                deliveryDetails : this.state.deliveryDetails
            }),
          })
          .then((response) => {
            return response.json();
          })
          this.props.history.push("/lets-eat");
    }

    render() {
        return <div className="container" style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <div>
            <h4>Does everything below look correct?</h4>
                <h6>Contact</h6>
                <div>
            First Name : {this.state.deliveryDetails.firstName}
            <Input type= "text" name="firstName" onInput={this.changeHandler} placeholder={this.props.user.firstName}></Input>
            Last Name : {this.state.deliveryDetails.lastName}
            <Input type= "text" name="lastName" onChange={this.changeHandler} placeholder={this.props.user.lastName}></Input>
            Phone : {this.state.deliveryDetails.phone}
            <Input type= "text" name="phone" onChange={this.changeHandler} placeholder={this.props.user.phone}></Input>
            Address : {this.state.deliveryDetails.address}
            <Input type= "text" name="address" onChange={this.changeHandler} placeholder={this.props.user.address}></Input>
            Delivery Instructions : {this.state.deliveryDetails.instructions}
            <Input type= "text" name="instructions" onChange={this.changeHandler} placeholder={this.props.user.instructions}></Input>
            <hr/>
            <Button onClick={this.placeOrder}>Place Order!</Button>
        </div>
        </div>
        <Cart/>
        </div>
    }
}

const mapStateToProps = (state) => {
    const { restaurants, restDetails, cart, deliveryDetails,...user } = state;
    return {user,deliveryDetails,restDetails,cart};
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryDetailsSuccessDispatch : (payload,dateString) => { dispatch(onGetDeliveryDetailsSuccess(payload,dateString))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(loginCheck(isBuyer(Checkout)));