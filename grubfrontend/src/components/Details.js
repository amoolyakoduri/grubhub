import React from 'react';
import { connect } from 'react-redux';
import {Button , Input} from 'reactstrap';
import { onUpdateDetailsSuccess, onUpdateDetailsFailure } from '../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';


class Details extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : {},
            emailId: this.props.user.emailId,
            firstName : "",
            lastName : "",
            address : "",
            phone : ""
        }
        this.update = this.update.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    // static getDerivedStateFromProps(props) {
    //     return {user: props.user};
    // }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({email: values.email, error: true});
      }

    update() {
        fetch('http://localhost:3003/updateDetails',{
            method:'POST',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                emailId : this.props.emailId,
                user : this.state.user
            })
        })
        .then( (response) => {
            return response.json();
        }).then( (myJson) => {
            console.log("myJson : ",myJson);
            // if(myJson.payload.affectedRows===0) {
            //     this.props.updateDetailsFailureDispatch();
            // } else {
                //fetch('http://localhost:3003/getUserDetails/'+this.state.emailId)
                //.then( (results) => {
                //    return results.json();
                //}).then( (resultJson) => {
                    console.log("PROPS ARE :",myJson.payload);
                    this.props.updateDetailsSuccessDispatch(myJson.payload);
                //})
            // }
        }).catch(e => {
            this.props.updateDetailsFailureDispatch();
        })
    }

    changeHandler(event) {
        console.log(event.target.value);
        let key = event.target.name;
        let value = event.target.value;
        console.log("key is ",key);
        this.setState(state => { 
            return Object.assign({}, state, { user: Object.assign({},state.user,{ [key] : value})})
        });
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({email: values.email, error: true});
      }

    render() {
        return <div>
            <AvForm  onInvalidSubmit={this.handleInvalidSubmit}>
            First Name : {this.state.user.firstName}
            <AvField label = " First Name :" type= "text" name="firstName" onInput={this.changeHandler} placeholder={this.props.user.firstName} ></AvField>
            Last Name : {this.state.user.lastName}
            <AvField type= "text" label = " Last Name :" name="lastName" onChange={this.changeHandler} placeholder={this.props.user.lastName} ></AvField>
            Phone : {this.state.user.phone}
            <AvField type= "text" label = "Phone : " name="phone" onChange={this.changeHandler} placeholder={this.props.user.phone} ></AvField>
            Address : {this.state.user.address}
            <AvField type= "text" name="address" label="Address : " onChange={this.changeHandler} placeholder={this.props.user.address} ></AvField>
            Email : {this.state.user.email}
            <AvField type= "email" name="emailId" label= "Email : "  onChange={this.changeHandler} placeholder={this.props.user.emailId} ></AvField>
            <Button onClick={this.update}>Update Details</Button>
            </AvForm>
        </div>

    }
}

const mapStateToProps = (state) => {
    const { restaurants,emailId, ...user } = state;
    return {user,emailId};
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDetailsSuccessDispatch : (payload) => {console.log("pl :",payload); dispatch(onUpdateDetailsSuccess(payload))},
        updateDetailsFailureDispatch : () => { dispatch(onUpdateDetailsFailure())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Details);