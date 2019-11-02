import React from 'react';
import {Button , Input} from 'reactstrap';
import {connect} from 'react-redux';
import { onUpdateRestDetailsSuccess, onUpdateRestDetailsFailure} from './../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';



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
        const updatedRestDetails = Object.assign({},this.props.restDetails, this.state.restDetails);
        fetch('/api/updateRestDetails',{
            method:'POST',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                restDetails : updatedRestDetails,
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

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({email: values.email, error: true});
      }

    render() {
        return <div>
            <h4>Restaurant Details</h4>
            <AvForm  onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.update}>
            <AvField type= "text" label={"Name : "+this.props.restDetails.name} name="name" onInput={this.changeHandler} placeholder={this.props.name}></AvField>
            <AvField type= "text" label={"Cuisine : "+this.props.restDetails.cuisine} name="cuisine" onChange={this.changeHandler} placeholder={this.props.cuisine}></AvField>
            <AvField type= "text" name="phone" label={"Phone : "+this.props.restDetails.phone} onChange={this.changeHandler} placeholder={this.props.phone}></AvField>
            <AvField type= "text" name="address" label={"Address : "+this.props.restDetails.address} onChange={this.changeHandler} placeholder={this.props.address}></AvField>
            <AvField type= "text" name="zip" label={"Zipcode : "+this.props.restDetails.zip} onChange={this.changeHandler} placeholder={this.props.zip}></AvField>
            <Button >Update Details</Button>
            </AvForm>
        </div>
    }
}

const mapStateToProps = (state) => {
    const { restDetails } = state;
    return {restDetails};
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateRestDetailsSuccessDispatch : (payload) => { dispatch(onUpdateRestDetailsSuccess(payload))},
        updateRestDetailsFailureDispatch : () => { dispatch(onUpdateRestDetailsFailure())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RestaurantDetails);