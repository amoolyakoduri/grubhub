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
            <img width= "200px" src={"/"+this.props.displayPic}></img>
            </div>
            <Details/>
            { this.props.type=== "owner" && 
                <RestaurantDetails/> }
        </div>
    }
}

const mapStateToProps = (state) => {
    const {type , isLoggedIn, displayPic } = state;
    return {type:type,isLoggedIn:isLoggedIn,displayPic};
}


export default connect(mapStateToProps)(loginCheck(Profile));