import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { onUpdateDetailsSuccess, onUpdateDetailsFailure } from '../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';

var md5 = require('md5');


class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            emailId: this.props.user.emailId,
            firstName: "",
            lastName: "",
            address: "",
            phone: "",
            error1: null,
            error2: null
        }
        this.update = this.update.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({ email: values.email, error: true });
    }

    update() {
        fetch('/updateDetails', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                emailId: this.props.emailId,
                user: this.state.user
            })
        })
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                console.log("myJson : ", myJson);
                if (myJson.payload == null) {
                    this.setState({
                        error1: myJson.message
                    })
                } else
                    this.props.updateDetailsSuccessDispatch(this.state.user);
            }
            )
    }

    updatePassword = (event) => {
        fetch('/updatePassword', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                emailId: this.state.user.emailId,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.payload == null) {
                this.setState({
                    error2: myJson.message
                })
            } else {
                this.setState({
                    error2: null
                })
            }
        })
    }

    changeHandler(event) {
        console.log(event.target.value);
        let key = event.target.name;
        let value = event.target.value;
        console.log("key is ", key);
        this.setState(state => {
            return Object.assign({}, state, { user: Object.assign({}, state.user, { [key]: value }) })
        });
    }

    changePasswordHandler = (event) => {
        var pword = md5(event.target.value);
        this.setState({ [event.target.name]: pword });
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({ email: values.email, error: true });
    }

    render() {
        return <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div className="container">
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.update}>
                    <AvField label=" First Name :" type="text" name="firstName" onInput={this.changeHandler} placeholder={this.props.user.firstName} ></AvField>
                    <AvField type="text" label=" Last Name :" name="lastName" onChange={this.changeHandler} placeholder={this.props.user.lastName} ></AvField>
                    <AvField type="text" label="Phone : " name="phone" onChange={this.changeHandler} placeholder={this.props.user.phone} ></AvField>
                    <AvField type="text" name="address" label="Address : " onChange={this.changeHandler} placeholder={this.props.user.address} ></AvField>
                    <AvField type="email" name="emailId" label="Email : " onChange={this.changeHandler} placeholder={this.state.user.emailId} ></AvField>
                    <Button >Update Details</Button>
                    {this.state.error1 && <div style={{ color: "red" }}>{this.state.error1}</div>}
                </AvForm>
            </div>
            <div className="container">
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.updatePassword}>
                    <AvField type="email" name="emailId" label="Email : " onChange={this.changeHandler} placeholder={this.state.user.emailId} required ></AvField>
                    <AvField type="password" name="oldPassword" label="Old Password : " onChange={this.changePasswordHandler} required></AvField>
                    <AvField type="password" name="newPassword" label="New Password : " onChange={this.changePasswordHandler} required></AvField>
                    <Button >Update Password</Button>
                    {this.state.error2 && <div style={{ color: "red" }}>{this.state.error2}</div>}
                </AvForm>
            </div>
        </div>

    }
}

const mapStateToProps = (state) => {
    const { restaurants, emailId, ...user } = state;
    return { user, emailId };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDetailsSuccessDispatch: (payload) => { console.log("pl :", payload); dispatch(onUpdateDetailsSuccess(payload)) },
        updateDetailsFailureDispatch: () => { dispatch(onUpdateDetailsFailure()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);