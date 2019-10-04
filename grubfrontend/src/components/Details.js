import React from 'react';
import { connect } from 'react-redux';
import {Button , Input} from 'reactstrap';
import { onUpdateDetailsSuccess, onUpdateDetailsFailure } from '../actions/actions';

class Details extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : {},
            emailId: props.user.emailId
        }
        this.update = this.update.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    // static getDerivedStateFromProps(props) {
    //     return {user: props.user};
    // }

    update() {
        fetch('http://localhost:3003/updateDetails',{
            method:'POST',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                emailId : this.state.emailId,
                user : this.state.user
            })
        })
        .then( (response) => {
            return response.json();
        }).then( (myJson) => {
            console.log("myJson : ",myJson);
            if(myJson.payload.affectedRows===0) {
                this.props.updateDetailsFailureDispatch();
            } else {
                //fetch('http://localhost:3003/getUserDetails/'+this.state.emailId)
                //.then( (results) => {
                //    return results.json();
                //}).then( (resultJson) => {
                    console.log("PROPS ARE :",this.state.user);
                    this.props.updateDetailsSuccessDispatch(this.state.user);
                //})
            }
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

    render() {
        return <div>
            First Name : {this.state.user.firstName}
            <Input type= "text" name="firstName" onInput={this.changeHandler} placeholder={this.props.user.firstName}></Input>
            Last Name : {this.state.user.lastName}
            <Input type= "text" name="lastName" onChange={this.changeHandler} placeholder={this.props.user.lastName}></Input>
            Phone : {this.state.user.phone}
            <Input type= "text" name="phone" onChange={this.changeHandler} placeholder={this.props.user.phone}></Input>
            Address : {this.state.user.address}
            <Input type= "text" name="address" onChange={this.changeHandler} placeholder={this.props.user.address}></Input>
            Email : {this.state.user.email}
            <Input type= "text" name="emailId" onChange={this.changeHandler} placeholder={this.props.user.emailId}></Input>
            <Button onClick={this.update}>Update Details</Button>
        </div>

    }
}

const mapStateToProps = (state) => {
    const { restaurants, ...user } = state;
    return {user};
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDetailsSuccessDispatch : (payload) => {console.log("pl :",payload); dispatch(onUpdateDetailsSuccess(payload))},
        updateDetailsFailureDispatch : () => { dispatch(onUpdateDetailsFailure())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Details);