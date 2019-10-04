import React from 'react';
import {connect} from 'react-redux';
import {isBuyer, isLoggedIn} from './../helpers/index';
import Unauthorized from './Unauthorized';

const isBuyerComponent  = (WrappedComponent) => {
    class WrappedComponentFromBuyer extends React.Component {
        render() {
                const { props } = this;
                return isLoggedIn() && isBuyer(this.props.type) ? <WrappedComponent {...props} /> : <Unauthorized/>
         };   
    }
    return connect(mapStateToProps)(WrappedComponentFromBuyer); 
}

const mapStateToProps = (state) => {
    const {type} = state;
    return {type}; 
}

export default isBuyerComponent;
