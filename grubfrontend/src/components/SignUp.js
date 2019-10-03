import React from 'react' ;
import {
    Card, CardBody,
    CardTitle,  Button,Form, FormGroup, Label, Input,
  } from 'reactstrap';
import {onSignUpSuccess,onSignUpFailure} from './../actions/actions'
import {connect} from 'react-redux';

class SignUp extends React.Component {

    constructor(){
        super();
        this.state={
            emailId: null,
            password : null,
            firstName : null,
            lastName : null,
            type : null
        }
        this.signUp = this.signUp.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.changeRadioHandler = this.changeRadioHandler.bind(this);
    }

    signUp(e){
        e.preventDefault();
        fetch('http://localhost:3003/signUp',{
        headers: {
          'Content-Type': 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({ 
            emailId : this.state.emailId, 
            password : this.state.password,
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            type : this.state.type
        }),
      })
      .then((response) => {
          console.log(response)
        return response.json();
      }).then((jsonRes) => {
        console.log("jsonRes is: ",jsonRes);
        if(jsonRes.payload == null) {
          console.log("Couldnt signUp");
          this.props.signUpFailureDispatch();
      } else {
        console.log(" Registered ! ", jsonRes);
        if(this.state.type==="buyer") 
        this.props.history.push("/lets-eat");
        else 
        this.props.history.push('/signUpOwner');
        this.props.signUpSuccessDispatch(jsonRes);
      }
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

    changeRadioHandler(event) {
        let value = event.target.value;
        console.log("value is ",value);
        this.setState({type:value});
    }

    render(){
        return <div>
            <Card>
        <CardBody>
          <CardTitle>Sign up for Grubhub account!</CardTitle>
          <Form >
          <FormGroup>
          <Label for="exampleEmail">First Name:</Label>
          <Input type="text" name="firstName" id="firstName" onChange = {this.changeHandler} placeholder="name" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Last Name:</Label>
          <Input type="text" name="lastName" id="lastName" onChange = {this.changeHandler} placeholder="name" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="emailId" id="emailId" onChange = {this.changeHandler} placeholder="email" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="password" onChange={this.changeHandler} placeholder="password" />
        </FormGroup>
        <div class="form-check">
    <input class="form-check-input" type="radio" name="type" id="buyer" value="buyer" onChange={this.changeRadioHandler}/>
    <label class="form-check-label" for="buyer">
       Buyer
     </label>
    </div>
        <div class="form-check">
     <input class="form-check-input" type="radio" name="type" id="owner" value="owner" onChange={this.changeRadioHandler}/>
     <label class="form-check-label" for="owner">
    Owner
     </label>
    </div>
        <FormGroup check>
          <Label check>
            <Input onChange={this.handleRememberMeChange} type="checkbox" />{' '}
            Keep me Signed in!
          </Label>
        </FormGroup>
          <Button type="submit" onClick={this.signUp}>Submit</Button>
          </Form>
        </CardBody>
      </Card>
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUpSuccessDispatch : (payload) => { dispatch(onSignUpSuccess(payload))},
    signUpFailureDispatch : () => { dispatch(onSignUpFailure())}
  }
}


export default connect(null,mapDispatchToProps)(SignUp);