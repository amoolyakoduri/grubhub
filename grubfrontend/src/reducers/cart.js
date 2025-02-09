import {
    BUYER_LOGIN_SUCCESS,
    GET_REST_DETAILS_SUCCESS, ADD_TO_CART_SUCCESS,
    DELETE_ORDER_ITEM_SUCCESS, CURRENT_REST_DETAILS_SUCCESS,
    GET_ORDER_ITEMS_SUCCESS, GET_ORDER_ITEMS_FAILURE
} from './../actions/actions';
import cloneDeep from 'lodash.clonedeep'

function app(state = [], action) {
    switch (action.type) {
        case BUYER_LOGIN_SUCCESS:
            return [];
        case CURRENT_REST_DETAILS_SUCCESS:
            return [];
        case GET_REST_DETAILS_SUCCESS:
            return [];
        case ADD_TO_CART_SUCCESS:
            const cart = cloneDeep(state);
            cart.push(action.payload);
            return cart;
        case DELETE_ORDER_ITEM_SUCCESS:
            const nextCart = cloneDeep(state);
            const delIndex = nextCart.findIndex(c => c.itemName === action.payload.itemName);
            nextCart.splice(delIndex, 1);
            return nextCart;
        case GET_ORDER_ITEMS_SUCCESS:
            return Object.assign([], state, action.payload)
        case GET_ORDER_ITEMS_FAILURE:
            return [];
        default:
            return state;
    }
}

export default app;