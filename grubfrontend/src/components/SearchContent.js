import React from 'react';
import RestaurantContainer from './RestaurantContainer';
import { connect } from 'react-redux';


class SearchContent extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div style={{ color: "black" }}>
            {this.props.searchList ?
                <RestaurantContainer restaurants={this.props.searchList} display="tuple" /> :
                <RestaurantContainer restaurants={this.props.restaurants} display="tuple" />
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    const { searchList, restaurants } = state.app;
    return { searchList, restaurants };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContent);