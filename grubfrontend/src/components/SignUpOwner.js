import React from 'react';
import {
  Card, CardBody,
  CardTitle,  Button,Form, FormGroup, Label, Input,
} from 'reactstrap';
import {connect} from 'react-redux';
import { onRestRegisterationFailure, onRestRegisterationSuccess} from './../actions/actions'
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';


class SignUpOwner extends React.Component {
  constructor(){
    super();
    this.state={
      name : null,
      zipcode : null,
      address : null,
      phone : null,
      cuisine : null,
      displayPic : null

  }
  this.register = this.register.bind(this);
  this.changeHandler = this.changeHandler.bind(this);
  }

  register(event){
    var jwtToken = ls.get('jwtToken').substring(3);
    event.preventDefault();
    const data = new FormData();
        data.append('name',this.state.name);
        data.append('cuisine', this.state.cuisine);
        data.append('address',this.state.address);
        data.append('zipcode',this.state.zipcode);
        data.append('phone',this.state.phone);
        data.append('displayPic',this.state.displayPic);
        data.append('emailId',this.props.emailId);
    fetch('/api/registerRestaurant',{
    method : 'POST',
    body:data,
  })
  .then((response) => {
      console.log(response)
    return response.json();
  }).then((jsonRes) => {
    console.log("jsonRes is: ",jsonRes);
    if(jsonRes.success == false) {
      console.log("Couldnt register");
      this.props.restRegisterFailureDispatch();
  } else {
    console.log(" Registered ! ", jsonRes);
    // let payload = Object.assign({},this.state,{
    //   restId:jsonRes.payload.insertId
    // })
    //this.props.restRegisterSuccessDispatch(payload);
  }
  this.props.history.push("/login"); 

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

fileHandler = (event) => {
  this.setState({displayPic : event.target.files[0]});

}

  render(){
    return <div className="container">
      <Card>
        <CardBody>
          <CardTitle>Restaurant details!</CardTitle>
          <AvForm  onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.register}>
          <FormGroup>
          <AvField type="text" name="name" id="name" label="Restaurant Name:" onChange = {this.changeHandler} placeholder="name" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="text" name="cuisine" label="Cuisine:" id="cuisine" onChange = {this.changeHandler} placeholder="cuisine" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="text" name="address" label="Address:" id="address" onChange = {this.changeHandler} placeholder="address" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="text" name="phone" label="Phone:" id="phone" onChange={this.changeHandler} placeholder="phone" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="text" label="Zipcode:" name="zipcode" id="zipcode" onChange={this.changeHandler} placeholder="zipcode" required/>
        </FormGroup>
        <AvField type='file' name="displayPic" id='multi' label="Upload display picture" onChange={this.fileHandler} accept="image/*" required/>
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
  const {emailId} = state.app;
  return {emailId}
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpOwner);