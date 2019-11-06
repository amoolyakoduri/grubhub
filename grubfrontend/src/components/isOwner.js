import React from 'react';
import { connect } from 'react-redux';
import { isOwner, isLoggedIn } from './../helpers/index';
import Unauthorized from './Unauthorized';

const isOwnerComponent = (WrappedComponent) => {
    class WrappedComponentFromBuyer extends React.Component {
        render() {
            const { props } = this;
            return isLoggedIn() && isOwner(this.props.userType) ? <WrappedComponent {...props} /> : <Unauthorized />
        };
    }
    return connect(mapStateToProps)(WrappedComponentFromBuyer);
}

const mapStateToProps = (state) => {
    const userType = state.app.userType;
    return { userType };
}

export default isOwnerComponent;