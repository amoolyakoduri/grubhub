import React from 'react';
import {
  Card, CardBody,
  CardTitle, Button,
} from 'reactstrap';
import BuyerHome from './BuyerHome';
import { connect } from 'react-redux'
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';



import { onOwnerLoginSuccess, onBuyerLoginSuccess, onLoginFailure } from '../actions/actions';


var md5 = require('md5');

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      emailId: null,
      password: null,
      rememberMe: false,
      isLoggedIn: false,
      error: null
    }
    this.login = this.login.bind(this);
  }

  handleInvalidSubmit = (event, errors, values) => {
    this.setState({ email: values.email, error: true });
  }


  login(event) {
    event.preventDefault();
    fetch('/api/auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ emailId: this.state.emailId, password: this.state.password }),
    })
      .then((response) => {
        return response.json();
      }).then((jsonRes) => {
        console.log("jsonRes is: ", jsonRes);
        if (jsonRes.success == false) {
          console.log("Couldnt login");
          this.setState({
            error: jsonRes.message
          })
          this.props.loginFailureDispatch();
        } else {
          console.log("logged in ! ", jsonRes);
          ls.set('jwtToken', jsonRes.token);
          ls.set('isLoggedIn', true);
          ls.set('userType', jsonRes.payload.userType);
          if (jsonRes.payload.userType === "owner") {
            this.props.ownerLoginSuccessDispatch(jsonRes);
            this.props.history.push("/home");
          }
          else {
            this.props.buyerLoginSuccessDispatch(jsonRes);
            this.props.history.push("/lets-eat");
          }
        }
      })

  }

  handleChange = (event) => {
    this.setState({ emailId: event.target.value });
  }
  handlePasswordChange = (event) => {
    var pword = md5(event.target.value);
    this.setState({ password: pword });
  }

  render() {
    if (this.state.isLoggedIn)
      return <BuyerHome />
    return (
      <div class="container">
        <Card >
          <CardBody>
            <CardTitle><h3>Sign in with your Grubhub account!</h3></CardTitle>
            <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.login}>
              <AvField name="email" label="Email Address" id="emailId" type="email" onChange={this.handleChange} placeholder="email" required />
              <AvField name="password" label="Password" id="password" type="password" onChange={this.handlePasswordChange} placeholder="password" required />
              <Button style={{ justifyContent: "center" }} >Submit</Button>
            </AvForm>
            {this.state.error && <div style={{ color: "red" }}>{this.state.error}</div>}
          </CardBody>
        </Card>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  const isLoggedIn = state.app.isLoggedIn;
  return { isLoggedIn };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ownerLoginSuccessDispatch: (payload) => { dispatch(onOwnerLoginSuccess(payload)) },
    buyerLoginSuccessDispatch: (payload) => { dispatch(onBuyerLoginSuccess(payload)) },
    loginFailureDispatch: () => { dispatch(onLoginFailure()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);