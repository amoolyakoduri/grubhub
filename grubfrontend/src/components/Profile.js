import React from 'react';
import pic from './../grub.png';
import {connect} from 'react-redux'
import Details from './Details';
import RestaurantDetails from './RestaurantDetails';
import loginCheck from './LoginCheck';

class Profile extends React.Component {

    constructor() {
        super();
        this.state = {
        }
    }

    render(){
        return <div class="container" style = {{border:"black"}}>
            <div>
            <img src={pic}></img>
            </div>
            <Details/>
            { this.props.type=== "owner" && 
                <RestaurantDetails/> }
        </div>
    }
}

const mapStateToProps = (state) => {
    const {type , isLoggedIn } = state;
    return {type:type,isLoggedIn:isLoggedIn};
}


export default connect(mapStateToProps)(loginCheck(Profile));