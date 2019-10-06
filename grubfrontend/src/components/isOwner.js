import React from 'react';
import { connect } from 'react-redux';
import { isOwner, isLoggedIn } from './../helpers/index';
import Unauthorized from './Unauthorized';

const isOwnerComponent = (WrappedComponent) => {
    class WrappedComponentFromBuyer extends React.Component {
        render() {
            const { props } = this;
            return isLoggedIn() && isOwner(this.props.type) ? <WrappedComponent {...props} /> : <Unauthorized />
        };
    }
    return connect(mapStateToProps)(WrappedComponentFromBuyer);
}

const mapStateToProps = (state) => {
    const { type } = state;
    return { type };
}

export default isOwnerComponent;