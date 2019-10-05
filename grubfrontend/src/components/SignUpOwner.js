import React from 'react';
import {
  Card, CardBody,
  CardTitle,  Button,Form, FormGroup, Label, Input,
} from 'reactstrap';
import {connect} from 'react-redux';
import { onRestRegisterationFailure, onRestRegisterationSuccess} from './../actions/actions'
import { AvForm, AvField } from 'availity-reactstrap-validation';


class SignUpOwner extends React.Component {
  constructor(){
    super();
    this.state={
      name : null,
      zipcode : null,
      address : null,
      phone : null,
      cuisine : null
  }
  this.register = this.register.bind(this);
  this.changeHandler = this.changeHandler.bind(this);
  }

  register(event){
    event.preventDefault();
    fetch('http://localhost:3003/register',{
    headers: {
      'Content-Type': 'application/json'
    },
    method : 'POST',
    body : JSON.stringify({ 
        emailId : this.props.emailId, 
        name : this.state.name,
        cuisine : this.state.cuisine,
        address : this.state.address,
        zipcode : this.state.zipcode,
        phone : this.state.phone
    }),
  })
  .then((response) => {
      console.log(response)
    return response.json();
  }).then((jsonRes) => {
    console.log("jsonRes is: ",jsonRes);
    if(jsonRes.payload == null) {
      console.log("Couldnt register");
      this.props.restRegisterFailureDispatch();
  } else {
    console.log(" Registered ! ", jsonRes);
    let payload = Object.assign({},this.state,{
      restId:jsonRes.payload.insertId
    })
    this.props.restRegisterSuccessDispatch(payload);
  }
  this.props.history.push("/home"); 

  })
}

  changeHandler(event) {
    console.log(event.target.value);
    let key = event.target.name;
    let value = event.target.value;
    console.log("key is ",key);
    this.setState({[key]:value});
    console.log("state is ",this.state);
}

handleInvalidSubmit = (event, errors, values) => {
  this.setState({email: values.email, error: true});
}

  render(){
    return <div>
      <Card>
        <CardBody>
          <CardTitle>Restaurant details!</CardTitle>
          <AvForm  onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.register}>
          <FormGroup>
          <Label for="name">Restaurant Name:</Label>
          <AvField type="text" name="name" id="name" label="Restaurant Name:" onChange = {this.changeHandler} placeholder="name" required/>
        </FormGroup>
        <FormGroup>
          <Label for="cuisine">Cuisine:</Label>
          <AvField type="text" name="cuisine" label="Cuisine:" id="cuisine" onChange = {this.changeHandler} placeholder="cuisine" required/>
        </FormGroup>
        <FormGroup>
          <Label for="address">Address:</Label>
          <AvField type="text" name="address" label="Address:" id="address" onChange = {this.changeHandler} placeholder="address" required/>
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone:</Label>
          <AvField type="text" name="phone" label="Phone:" id="phone" onChange={this.changeHandler} placeholder="phone" required/>
        </FormGroup>
        <FormGroup>
          <Label for="zipcode">Zipcode:</Label>
          <AvField type="text" label="Zipcode:" name="zipcode" id="zipcode" onChange={this.changeHandler} placeholder="zipcode" required/>
        </FormGroup>
          <Button type="submit" >Register!</Button>
          </AvForm>
        </CardBody>
      </Card>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    restRegisterSuccessDispatch : (payload) => { dispatch(onRestRegisterationSuccess(payload))},
    restRegisterFailureDispatch : () => { dispatch(onRestRegisterationFailure())}
  }
}

const mapStateToProps = (state) => {
  const {emailId} = state;
  return {emailId}
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpOwner);