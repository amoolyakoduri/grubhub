import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
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
import { connect } from 'react-redux';
import DraggableOrders from './DraggableOrders';
import { onOwnerLoginSuccess, onBuyerLoginSuccess, onLoginFailure } from '../actions/actions';
import { isLoggedIn } from '../helpers';
import { DndProvider } from 'react-dnd'
import Chat from './Chat';
	import HTML5Backend from 'react-dnd-html5-backend'
	
import Cart from './Cart';

class Main extends React.Component {

    componentDidMount() {
        if (isLoggedIn()) {
            fetch('/api/getUserDetailsFromSession')
                .then(res => res.json())
                .then(res => {
                    this.props.onOwnerLoginSuccess(res);
                })
                .catch(e => { })
        }
    }

    render() {
        return (
            <div>
                <Router>
                    {/*Render Different Component based on Route*/}
                    <Route path="/" component={CustomNavbar} />
                    <Route path="/login" component={Login} />
                    <Route path="/signUp" component={SignUp} />
                    <Route path="/signUpOwner" component={SignUpOwner} />
                    <Route path="/lets-eat" component={BuyerHome} />
                    <Route path="/search" component={Search} />
                    <Route path="/account" component={Account} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/home" component={OwnerHome} />
                    <Route path="/menu" component={OwnerMenu} />
                    <Route path='/placeOrder' component={PlaceOrder} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/cart" component={Cart} />
                    <Route path="/chat" component = {Chat} />
                    <Route path="/upcomingOrders" render = {() => <DndProvider backend={HTML5Backend}>
					<DraggableOrders />
				</DndProvider>} />
                </Router>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    onOwnerLoginSuccess: (payload) => dispatch(onOwnerLoginSuccess(payload))
})

export default connect(null, mapDispatchToProps)(Main);