import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { onUpdateDetailsSuccess, onUpdateDetailsFailure } from '../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck'

var md5 = require('md5');


class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app: {},
            emailId: this.props.app.emailId,
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
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/user/updateDetails', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer${jwtToken}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                emailId: this.props.app.emailId,
                userDetails: this.state.app
            })
        })
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                console.log("myJson : ", myJson);
                if (myJson.success == false) {
                    this.setState({
                        error1: myJson.message
                    })
                } else
                    this.props.updateDetailsSuccessDispatch(this.state.app);
            }
            )
    }

    updatePassword = (event) => {
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/user/updatePassword', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer${jwtToken}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                emailId: this.state.app.emailId,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false) {
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
            return Object.assign({}, state, { app: Object.assign({}, state.app, { [key]: value }) })
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
                    <AvField type="text" label=" Last Name :" name="lastName" onChange={this.changeHandler} placeholder={this.props.app.lastName} ></AvField>
                    <AvField type="text" label="Phone : " name="phone" onChange={this.changeHandler} placeholder={this.props.app.phone} ></AvField>
                    <AvField type="text" name="address" label="Address : " onChange={this.changeHandler} placeholder={this.props.app.address} ></AvField>
                    <Button >Update Details</Button>
                    {this.state.error1 && <div style={{ color: "red" }}>{this.state.error1}</div>}
                </AvForm>
            </div>
            <div className="container">
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.updatePassword}>
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
    const { app } = state;
    return { app };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDetailsSuccessDispatch: (payload) => { console.log("pl :", payload); dispatch(onUpdateDetailsSuccess(payload)) },
        updateDetailsFailureDispatch: () => { dispatch(onUpdateDetailsFailure()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(loginCheck(isBuyer(Details)));