import React from 'react';
import {Route,BrowserRouter as Router} from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import Login from './Login';
import BuyerHome from './BuyerHome';
import Search from './Search';
import Account from './Account';
import Profile from './Profile';
import SignUpOwner from './SignUpOwner';
import SignUp from './SignUp';
import OwnerHome from './OwnerHome';
import OwnerMenu from './OwnerMenu';
import PlaceOrder from './PlaceOrder';
import Checkout from './Checkout';
import { connect } from 'react-redux'
import { onOwnerLoginSuccess, onBuyerLoginSuccess, onLoginFailure } from '../actions/actions';
import { isLoggedIn } from '../helpers';
import Cart from './Cart';

class Main extends React.Component {

    componentDidMount() {
        if(isLoggedIn()) {
            fetch('/getUserDetails')
            .then(res => res.json())
            .then(res => {
                this.props.onOwnerLoginSuccess(res);
            })
            .catch(e => {})
        }
    }

    render(){
        return(
            <div>
                <Router>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={CustomNavbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/signUpOwner" component={SignUpOwner}/>
                <Route path="/lets-eat" component={BuyerHome}/>
                <Route path="/search" component={Search}/>
                <Route path="/account" component={Account} />
                <Route path="/profile" component={Profile}/>
                <Route path="/signUp" component={SignUp}/>
                <Route path="/home" component={OwnerHome}/>
                <Route path="/menu" component={OwnerMenu}/>
                <Route path='/placeOrder' component={PlaceOrder}/>
                <Route path="/checkout" component={Checkout}/>
                <Route path="/cart" component={Cart}/>
                </Router>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    onOwnerLoginSuccess: (payload ) => dispatch(onOwnerLoginSuccess(payload))
})

export default connect(null, mapDispatchToProps)(Main);