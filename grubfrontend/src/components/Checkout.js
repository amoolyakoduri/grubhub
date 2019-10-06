import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { onGetDeliveryDetailsSuccess } from './../actions/actions';
import loginCheck from './LoginCheck'
import Cart from './Cart';
import isBuyer from './isBuyer';
import { AvForm, AvField } from 'availity-reactstrap-validation';



class Checkout extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            deliveryDetails: {}
        }

    }

    componentDidMount() {
        let payload = {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            phone: this.props.user.phone,
            address: this.props.user.address,
            instructions: "e.g. Check in with doorman"
        }
        this.setState({ deliveryDetails: payload })
        this.props.getDeliveryDetailsSuccessDispatch(payload);
    }

    changeHandler = (event) => {
        console.log(event.target.value);
        let key = event.target.name;
        let value = event.target.value;
        console.log("key is ", key);
        this.setState(state => {
            return Object.assign({}, state, { deliveryDetails: Object.assign({}, state.deliveryDetails, { [key]: value }) })
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
        var dateString = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        return dateString;
    }

    placeOrder = (event) => {
        event.preventDefault();
        let dateString = this.getDateString();
        this.props.getDeliveryDetailsSuccessDispatch(this.state.deliveryDetails, dateString);
        fetch('http://localhost:3003/placeOrder', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                emailId: this.props.user.emailId,
                restId: this.props.cart.restId,
                orderItems: this.props.cart.items,
                deliveryDetails: this.state.deliveryDetails
            }),
        })
            .then((response) => {
                return response.json();
            })
        this.props.history.push("/lets-eat");
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({ email: values.email, error: true });
    }

    render() {
        return <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
                <h4>Does everything below look correct?</h4>
                <h6>Contact</h6>
                <div>
                    <AvForm onValidSubmit={this.placeOrder} onInvalidSubmit={this.handleInvalidSubmit}>
                        <AvField type="text" name="firstName" label={"First Name : " + this.state.deliveryDetails.firstName} onChange={this.changeHandler} placeholder={this.props.user.firstName} ></AvField>
                        <AvField type="text" name="lastName" label={"Last Name : " + this.state.deliveryDetails.lastName} onChange={this.changeHandler} placeholder={this.props.user.lastName} ></AvField>
                        <AvField type="text" name="phone" onChange={this.changeHandler} label={"Phone : " + this.state.deliveryDetails.phone} placeholder={this.props.user.phone} required></AvField>
                        <AvField type="text" name="address" onChange={this.changeHandler} label={"Address : " + this.state.deliveryDetails.address} placeholder={this.props.user.address} required ></AvField>
                        <AvField type="text" name="instructions" onChange={this.changeHandler} label={"Delivery Instructions : " + this.state.deliveryDetails.instructions} placeholder={this.props.user.instructions} ></AvField>
                        <hr />
                        <Button >Place Order!</Button>
                    </AvForm>
                </div>
            </div>
            <Cart />
        </div>
    }
}

const mapStateToProps = (state) => {
    const { restaurants, restDetails, cart, deliveryDetails, ...user } = state;
    return { user, deliveryDetails, restDetails, cart };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryDetailsSuccessDispatch: (payload, dateString) => { dispatch(onGetDeliveryDetailsSuccess(payload, dateString)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(loginCheck(isBuyer(Checkout)));