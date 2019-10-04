import React from 'react';
import {Button , Input} from 'reactstrap';
import {connect} from 'react-redux';
import { onUpdateRestDetailsSuccess, onUpdateRestDetailsFailure} from './../actions/actions'


class RestaurantDetails extends React.Component {

    constructor() {
        super();
        this.state = {
            restDetails : {}
        }
        this.update = this.update.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.update = this.update.bind(this);
    }

    update() {
        fetch('http://localhost:3003/updateRestDetails',{
            method:'POST',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                restDetails : this.state.restDetails,
                restId : this.props.restDetails.id
            })
        })
        .then( (response) => {
            return response.json();
        }).then( (myJson) => {
            console.log("myJson : ",myJson);
            if(myJson.payload == null) {
                this.props.updateRestDetailsFailureDispatch();
            } else {
                this.props.updateRestDetailsSuccessDispatch(this.props.restDetails);
            }
        })
    }

    changeHandler(event) {
        console.log(event.target.value);
        let key = event.target.name;
        let value = event.target.value;
        console.log("key is ",key);
        this.setState(Object.assign({},this.state,{ restDetails : Object.assign(
                {},this.state.restDetails,{[key]:event.target.value})
        })) 
    }


    render() {
        return <div>
            <h4>Restaurant Details</h4>
            Name : {this.props.restDetails.name}
            <Input type= "text" name="name" onInput={this.changeHandler} placeholder={this.props.name}></Input>
            Cuisine : {this.props.restDetails.cuisine}
            <Input type= "text" name="cuisine" onChange={this.changeHandler} placeholder={this.props.cuisine}></Input>
            Phone : {this.props.restDetails.phone}
            <Input type= "text" name="phone" onChange={this.changeHandler} placeholder={this.props.phone}></Input>
            Address : {this.props.restDetails.address}
            <Input type= "text" name="address" onChange={this.changeHandler} placeholder={this.props.address}></Input>
            Zipcode : {this.props.restDetails.zipcode}
            <Input type= "text" name="zipcode" onChange={this.changeHandler} placeholder={this.props.zipcode}></Input>
            <Button onClick={this.update}>Update Details</Button>
        </div>
    }
}

const mapStateToProps = (state) => {
    const { restDetails, ...user } = state;
    return {restDetails};
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateRestDetailsSuccessDispatch : (payload) => { dispatch(onUpdateRestDetailsSuccess(payload))},
        updateRestDetailsFailureDispatch : () => { dispatch(onUpdateRestDetailsFailure())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RestaurantDetails);