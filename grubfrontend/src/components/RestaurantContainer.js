import React from 'react';
import pic from './../grub.png';
import RestoTuple from './RestoTuple';
import RestoCard from './RestoCard';
import './../css/RestoTuple.css'


class RestaurantContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants : []
        }
    }

    

    render() {
        let display = this.props.display;
        return  this.props.restaurants ? (<div >
            <h4> Restaurants </h4>
            {
                this.props.restaurants.length == 0 ?
                <h5>No restaurants to display</h5> :
               this.props.restaurants.map( resto => {
                    return display === "tuple" ?
                    <div>
                    <RestoTuple details = {resto}/>
                    </div> : 
                    <RestoCard details = {resto}/>
                   
                })
            }
        </div>) : null
    }
}

export default RestaurantContainer;