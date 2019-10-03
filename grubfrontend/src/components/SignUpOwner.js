import React from 'react';
import {
  Card, CardBody,
  CardTitle,  Button,Form, FormGroup, Label, Input,
} from 'reactstrap';
import {connect} from 'react-redux';
import { onRestRegisterationFailure, onRestRegisterationSuccess} from './../actions/actions'


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

  render(){
    return <div>
      <Card>
        <CardBody>
          <CardTitle>Restaurant details!</CardTitle>
          <Form >
          <FormGroup>
          <Label for="name">Restaurant Name:</Label>
          <Input type="text" name="name" id="name" onChange = {this.changeHandler} placeholder="name" />
        </FormGroup>
        <FormGroup>
          <Label for="cuisine">Cuisine:</Label>
          <Input type="text" name="cuisine" id="cuisine" onChange = {this.changeHandler} placeholder="cuisine" />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address:</Label>
          <Input type="text" name="address" id="address" onChange = {this.changeHandler} placeholder="address" />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone:</Label>
          <Input type="text" name="phone" id="phone" onChange={this.changeHandler} placeholder="phone" />
        </FormGroup>
        <FormGroup>
          <Label for="zipcode">Zipcode:</Label>
          <Input type="text" name="zipcode" id="zipcode" onChange={this.changeHandler} placeholder="zipcode" />
        </FormGroup>
          <Button type="submit" onClick={this.register}>Register!</Button>
          </Form>
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