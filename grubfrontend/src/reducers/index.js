import {LOGIN_FAILURE,OWNER_LOGIN_SUCCESS,BUYER_LOGIN_SUCCESS, 
        LOGOUT_SUCCESS, GET_RESTAURANTS_SUCCESS,
        UPDATE_DETAILS_SUCCESS, SIGNUP_FAILURE, SIGNUP_SUCCESS,
        REST_REGISTERATION_SUCCESS,
        GET_ORDERS_SUCCESS, 
        UPDATE_REST_DETAILS_SUCCESS,  GET_DELIVERY_DETAILS_SUCCESS,
        GET_PAST_ORDERS_SUCCESS, GET_PAST_ORDERS_FAILURE,
        GET_ORDER_ITEMS_SUCCESS, GET_ORDER_ITEMS_FAILURE,
        UPDATE_ORDER_SUCCESS, GET_UPCOMING_ORDERS_FAILURE,
        SEARCH_SUCCESS, GET_UPCOMING_ORDERS_SUCCESS,
        SEARCH_FAILURE,  SEND_MESSAGE_SUCCESS,
        GET_PAST_ORDERS_OWNER_SUCCESS,} from './../actions/actions';
import restDetails from './restDetails';
import cart from './cart';
import { combineReducers } from 'redux';
import  cloneDeep from 'lodash.clonedeep';

function app(state = {},action) {
    switch(action.type) {
        case  BUYER_LOGIN_SUCCESS:
            return Object.assign({},state,{
                emailId : action.payload.payload.emailId,
                firstName : action.payload.payload.firstName,
                lastName : action.payload.payload.lastName,
                phone : action.payload.payload.phone,
                isLoggedIn : true,
                address : action.payload.payload.address,
                userType : action.payload.payload.userType,
                displayPic : action.payload.payload.displayPic
            })
        case OWNER_LOGIN_SUCCESS:
            return Object.assign({},state,{
                emailId : action.payload.payload.emailId,
                firstName : action.payload.payload.firstName,
                lastName : action.payload.payload.lastName,
                phone : action.payload.payload.phone,
                isLoggedIn : true,
                address : action.payload.payload.address,
                userType : action.payload.payload.userType,
                displayPic : action.payload.payload.displayPic,
                token : action.payload.token
            })
        case LOGIN_FAILURE:
        case LOGOUT_SUCCESS: 
        case SIGNUP_FAILURE:
            return Object.assign({},{isLoggedIn : false,emailId:null,firstName:null})
        case GET_RESTAURANTS_SUCCESS:
            return Object.assign({},state,{
                restaurants : action.payload
            })
        case UPDATE_DETAILS_SUCCESS :
            return Object.assign({},state,{
                emailId : action.payload.emailId,
                firstName : action.payload.firstName,
                lastName : action.payload.lastName,
                phone : action.payload.phone,
                address : action.payload.address
            })
        case UPDATE_REST_DETAILS_SUCCESS :
            let nexState =  Object.assign({},state);
            let restDetails = nexState.restDetails;
            restDetails = {...restDetails,
                name : action.payload.name,
                cuisine : action.payload.cuisine,
                phone : action.payload.phone,
                address : action.payload.address,
                zipcode : action.payload.zipcode
            }
            return nexState;
        case SIGNUP_SUCCESS:
            return Object.assign({},state,{
                emailId : action.payload.emailId,
                userType : action.payload.userType,
            });

        case REST_REGISTERATION_SUCCESS :
            return Object.assign({},state, {
                restDetails : Object.assign({},{
                id : action.payload.restId,
                name : action.payload.name,
                cuisine : action.payload.cuisine,
                address : action.payload.address,
                zipcode : action.payload.zipcode,
                phone : action.payload.phone
            })})
        case GET_ORDERS_SUCCESS :
            return Object.assign({},state,{
                orders : action.payload
            })
        case GET_PAST_ORDERS_OWNER_SUCCESS : 
            return Object.assign({},state,{
                pastOrders : action.payload
            })
        
         
        
        case GET_DELIVERY_DETAILS_SUCCESS :
            return Object.assign({},state,{
                deliveryDetails : {
                    firstName : action.payload.firstName,
                    lastName : action.payload.lastName,
                    phone : action.payload.phone,
                    address : action.payload.address,
                    instructions : action.payload.instructions,
                    date : action.dateString
                }
            })
        case GET_PAST_ORDERS_SUCCESS : 
            return Object.assign({},state,{
                pastOrders : action.payload
            })
        case GET_PAST_ORDERS_FAILURE:
            return Object.assign({},state,{
                pastOrders : []
            })
        case GET_UPCOMING_ORDERS_SUCCESS : 
            return Object.assign({},state,{
                upcomingOrders : action.payload
            })
        case GET_UPCOMING_ORDERS_FAILURE:
            return Object.assign({},state,{
                upcomingOrders : []
            })
        case GET_ORDER_ITEMS_SUCCESS :
            return Object.assign({},state,{
                cart : action.payload
            })
        case GET_ORDER_ITEMS_FAILURE :
            return Object.assign({},state,{
                cart : []
            })
        case UPDATE_ORDER_SUCCESS :
            const futureState = cloneDeep(state);
            const orders = Object.assign([],futureState.orders);
            const index  = orders.findIndex( o => o._id == action.payload.orderId);
            orders[index].status = action.payload.status;
            futureState.orders = orders;
            return futureState;
        case SEARCH_SUCCESS :
            return Object.assign({},state, {
                searchList : action.payload
            })
        case SEARCH_FAILURE :
            return Object.assign({},state,{
                searchList : state.restaurants
            })
        default:
            return state;
    }
}

// export default app;
export default combineReducers({ restDetails, app, cart });