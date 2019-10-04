import React from 'react';
import RestaurantContainer from './RestaurantContainer';
import {} from './../actions/actions';
import {connect} from 'react-redux';


class SearchContent extends React.Component {
    constructor() {
        super();
    }

    render(){
        console.log("in search content")
        return <div style={{color:"black"}}>
            { this.props.searchList ?
            <RestaurantContainer restaurants = {this.props.searchList} display="tuple"/> :
            <RestaurantContainer restaurants = {this.props.restaurants} display="tuple"/>
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    const {searchList,restaurants} = state;
    return {searchList,restaurants};
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchContent);