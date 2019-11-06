import React from 'react';
import RestoTuple from './RestoTuple';
import RestoCard from './RestoCard';
import './../css/RestoTuple.css'


class RestaurantContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: []
        }
    }
    
    render() {
        return this.props.restaurants ? (<div >
            <h4 class="container" > Restaurants </h4>
            <div style={{ display: "flex", flexDirection: this.props.display === "card" ? "row" : "column" }}>
                {
                    this.props.restaurants.length == 0 ?
                        <h5>No restaurants to display</h5> :
                        this.props.restaurants.map(resto => {
                            return this.props.display == "card" ?
                                <RestoCard details={resto} /> :
                                <RestoTuple details={resto} />
                        })
                }
            </div>
        </div>) : null
    }
}

export default RestaurantContainer;