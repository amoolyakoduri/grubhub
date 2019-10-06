import React from 'react' ;
import {
    Card, CardBody,
    CardTitle,  Button,Form, FormGroup, Label, Input,
  } from 'reactstrap';
import {onSignUpSuccess,onSignUpFailure} from './../actions/actions'
import {connect} from 'react-redux';
import { AvForm, AvField,AvRadioGroup,AvRadio } from 'availity-reactstrap-validation';


class SignUp extends React.Component {

    constructor(){
        super();
        this.state={
            emailId: null,
            password : null,
            firstName : null,
            lastName : null,
            type : null,
            displayPic : null
        }
        this.signUp = this.signUp.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.changeRadioHandler = this.changeRadioHandler.bind(this);
    }

    signUp(e){
        e.preventDefault();
        const data = new FormData();
        data.append('emailId' , this.state.emailId);
        data.append('password',this.state.password);
        data.append('firstName', this.state.firstName);
        data.append('lastName',this.state.lastName);
        data.append('type',this.state.type);
        data.append('displayPic',this.state.displayPic);

        fetch('http://localhost:3003/signUp',{
        method : 'POST',
        body : data
        // body : JSON.stringify({ 
        //     emailId : this.state.emailId, 
        //     password : this.state.password,
        //     firstName : this.state.firstName,
        //     lastName : this.state.lastName,
        //     type : this.state.type
        // }),
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
        if(this.props.type==="buyer") 
        this.props.history.push("/lets-eat");
        else 
        this.props.history.push('/signUpOwner');
        this.props.signUpSuccessDispatch(jsonRes);
      }
      })
    }

    handleInvalidSubmit = (event, errors, values) => {
      this.setState({email: values.email, error: true});
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

    fileHandler = (event) => {
      this.setState({displayPic : event.target.files[0]});

    }

    render(){
        return <div className="container">
            <Card>
        <CardBody>
          <CardTitle><h3>Sign up for Grubhub account!</h3></CardTitle>
          <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.signUp}>
          <FormGroup>
          <AvField type="text" label="First Name:" name="firstName" id="firstName" onChange = {this.changeHandler} placeholder="name" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="text" name="lastName" label="Last Name:" id="lastName" onChange = {this.changeHandler} placeholder="name" required />
        </FormGroup>
        <FormGroup>
          <AvField type="email" name="emailId" id="emailId" label="Email:" onChange = {this.changeHandler} placeholder="email" required/>
        </FormGroup>
        <FormGroup>
          <AvField type="password" name="password" id="password" label="Password:" onChange={this.changeHandler} placeholder="password" required/>
        </FormGroup>

        <AvRadioGroup inline name="type" label="Account type" required>
          <AvRadio label="Buyer" value="buyer" name="type" id="buyer" onChange={this.changeRadioHandler} />
          <AvRadio label="Owner" value="owner" name="type" id="owner" onChange={this.changeRadioHandler} />
        </AvRadioGroup>
    <AvField type='file' id='multi' name="displayPic" label="Upload display picture" onChange={this.fileHandler} accept="image/*" required/>

          <Button type="submit" >Submit</Button>
          </AvForm>
        </CardBody>
      </Card>
        </div>
    }
}

const mapStateToProps = (state) => {
  const {type} = state;
  return {type};
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUpSuccessDispatch : (payload) => { dispatch(onSignUpSuccess(payload))},
    signUpFailureDispatch : () => { dispatch(onSignUpFailure())}
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(SignUp);