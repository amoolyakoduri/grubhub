import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { onGetDeliveryDetailsSuccess } from './../actions/actions';
import loginCheck from './LoginCheck'
import Cart from './Cart';
import isBuyer from './isBuyer';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';




class Checkout extends React.Component {
    constructor() {
        super();
        this.state = {
            app: {},
            deliveryDetails: {}
        }

    }

    componentDidMount() {
        let payload = {
            firstName: this.props.app.firstName,
            lastName: this.props.app.lastName,
            phone: this.props.app.phone,
            address: this.props.app.address
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
        var jwtToken = ls.get('jwtToken').substring(3);
        let dateString = this.getDateString();
        this.props.getDeliveryDetailsSuccessDispatch(this.state.deliveryDetails, dateString);
        fetch('/api/placeOrder', {
            headers: {
                "Authorization" : `Bearer${jwtToken}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                restPic: this.props.restDetails.displayPic,
                restName: this.props.restDetails.name,
                orderItems: this.props.cart,
                deliveryDetails: this.state.deliveryDetails
            }),
        }).then((response) => {
            return response.json();
        }).then( () => {
            this.props.history.push("/lets-eat");
        })
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
                        <AvField type="text" name="firstName" label={"First Name : " + this.state.deliveryDetails.firstName} onChange={this.changeHandler} placeholder={this.props.app.firstName} ></AvField>
                        <AvField type="text" name="lastName" label={"Last Name : " + this.state.deliveryDetails.lastName} onChange={this.changeHandler} placeholder={this.props.app.lastName} ></AvField>
                        <AvField type="text" name="phone" onChange={this.changeHandler} label={"Phone : " + this.state.deliveryDetails.phone} placeholder={this.props.app.phone} ></AvField>
                        <AvField type="text" name="address" onChange={this.changeHandler} label={"Address : " + this.state.deliveryDetails.address} placeholder={this.props.app.address}  ></AvField>
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
    const {  restDetails, cart, deliveryDetails, app} = state;
    return { app, deliveryDetails, restDetails, cart };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryDetailsSuccessDispatch: (payload, dateString) => { dispatch(onGetDeliveryDetailsSuccess(payload, dateString)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)//(loginCheck(isBuyer(Checkout)));