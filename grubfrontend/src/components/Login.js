import React from 'react';
import {
    Card, CardBody,
    CardTitle,  Button,Form, FormGroup, Label, Input,
  } from 'reactstrap';
import BuyerHome from './BuyerHome';
import { connect } from 'react-redux'

import { onOwnerLoginSuccess, onBuyerLoginSuccess, onLoginFailure } from '../actions/actions';


var md5 = require('md5');  

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            emailId : null,
            password : null,
            rememberMe : false,
            isLoggedIn : false,
            error: null
        }
        this.login  = this.login.bind(this);
    }

    

    login(event) {
      event.preventDefault();
      console.log("in submit ",this.state);
      // if(this.state.emailId== null || this.state.password==null ||
      //   this.state.emailId==="" || this.state.password==="") {
      //     this.setState({
      //       error: "Enter valid credentials"
      //     })
      //     return ;
      //   }
      fetch('http://localhost:3003/login',{
        headers: {
          'Content-Type': 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({ emailId : this.state.emailId, password : this.state.password}),
      })
      .then((response) => {
        return response.json();
      }).then((jsonRes) => {
        console.log("jsonRes is: ",jsonRes);
        if(jsonRes.payload == null) {
          console.log("Couldnt login");
          this.setState({
            error: jsonRes.message
          })
          this.props.loginFailureDispatch();
      } else {
        console.log("logged in ! ", jsonRes);
        if(jsonRes.payload.type === "owner") {
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

    handleChange =(event) => {
      this.setState({emailId : event.target.value});
    }
    handlePasswordChange = (event) => {
      var pword = md5(event.target.value);
      this.setState({password : pword});
    }
    handleRememberMeChange = (event) => {
      this.setState({rememberMe:event.target.value});
    }

    render() {
      if(this.state.isLoggedIn)
      return <BuyerHome/>
        return (
            <div>
      <Card class="container">
        <CardBody>
          <CardTitle>Sign in with your Grubhub account!</CardTitle>
          <Form noValidate="false">
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" required="true" id="emailId" req  onChange = {this.handleChange} placeholder="email" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="password" onChange={this.handlePasswordChange} placeholder="password" />
        </FormGroup>
          {this.state.error && <div style={{color: "red"}}>{this.state.error}</div>}
          <Button type="submit" onClick={this.login}>Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
          );
    }

}

 const mapStateToProps = (state) => {
  const isLoggedIn = state;
  return {isLoggedIn : isLoggedIn};
}

const mapDispatchToProps = (dispatch) => {
  return {
    ownerLoginSuccessDispatch : (payload) => {dispatch(onOwnerLoginSuccess(payload) )},
    buyerLoginSuccessDispatch : (payload) => { dispatch(onBuyerLoginSuccess(payload))},
    loginFailureDispatch : () => {dispatch(onLoginFailure())}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);