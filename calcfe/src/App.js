import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Jumbotron, Button , FormGroup, Label, Input,Alert} from 'reactstrap';
import axios from 'axios';



class App extends React.Component{ 

  constructor() {
    super();
    this.state = {
      val1 : null,
      val2 : null,
      op : null,
      error: null,
      result: null
    }
    this.evaluate = this.evaluate.bind(this);
    this.handleVal1 = this.handleVal1.bind(this);
    this.handleVal2 = this.handleVal2.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handleVal1(event) {
    console.log("in val1");
    this.setState({
      val1 : event.target.value
    });
  }

  handleVal2(event) {
    this.setState({
      val2 : event.target.value
    });
  }

  handleOptionChange(changeEvent) {
    this.setState({
      op: changeEvent.target.value
    });
  }


  evaluate(e) {
    console.log("here");
      //prevent page from refresh
      e.preventDefault();
      const val1 =  this.state.val1;
      const val2 =  this.state.val2;
      let operator = this.state.op;
      if( val1==="" || val2==="" || operator==="" || operator===null
       || val1=== null || val2===null ) {
        console.log("in type check");
        this.setState({error: 'Enter numbers and operator please'})
        
      } else if ((val2==="0" && operator==="divide")) {
       
        this.setState({error: 'Denominator cannot be zero'})
       
      } else {
        this.setState({error: null})
      }
      let  data= {
          "val1":val1,
          "val2":val2
        };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post('http://localhost:3002/'+operator,data)
          .then(response => {
              console.log("response is ",response);
              if(response.status===200 || response.status===204){
                this.setState({result: response.data.result});
              }
              }
          );
  }

  render() {
  return (
    <span className="App container" style={{"display":"flex"}} >
      <Jumbotron>
        <h5 className="display-3">Calculate! </h5>
        <p className="lead">This is a simple calculator app that only supports addition, subtratction, multiplication and division between any two values.</p>
        <hr className="my-2" />
        <div style={{"display":"flex","flexDirection":"row","justifyContent":"space-around"}}>
        <FormGroup>
          <Label for="exampleText">First Number</Label>
          <Input style={{width:"auto"}} type="number" name="val1" onChange={this.handleVal1}/>
        </FormGroup>
        <div style={{"display":"flex","flexDirection":"column"}}>
        <FormGroup check>
            <Label check>
              <Input  required type="radio" name="ops" onChange={this.handleOptionChange} value="add"/>{' '}+
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="ops" onChange={this.handleOptionChange} value="subtract"/>{' '}-
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="ops" onChange={this.handleOptionChange} value="multiply"/>{' '}*
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="ops" onChange={this.handleOptionChange} value="divide"/>{' '}/
            </Label>
          </FormGroup>
          </div>
        <FormGroup required>
          <Label for="exampleText">Second Number</Label>
          <Input style={{width:"auto"}} type="number" name="val2" onChange={this.handleVal2} required />
        </FormGroup>
        </div>
        <p className="lead">
          <Button style={{"marginTop":"30px"}} onClick={this.evaluate} color="primary">Calculate</Button>
        </p>
       { this.state.error && <Alert id="alert" hidden color="danger">
         {this.state.error}
      </Alert>}
   { this.state.result && <h5 className="display-3" id="result"> {this.state.result}</h5>}
      </Jumbotron>
    </span>
  );
}
}

export default App;
