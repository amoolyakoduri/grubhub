import React from 'react';
import { isLoggedIn } from '../helpers';
import { Redirect } from 'react-router-dom'

const loginCheck = (WrappedComponent, redirect = true) => {
    return class extends React.Component{ 
        render(){
            const { props } = this;
                return isLoggedIn() ? <WrappedComponent {...props} /> : (redirect ? <Redirect to='/login' /> : <WrappedComponent {...props} />)
        };
    }
}

export default loginCheck;
