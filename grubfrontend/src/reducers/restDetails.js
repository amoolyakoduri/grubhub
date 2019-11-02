import { combineReducers } from 'redux'
import {LOGIN_FAILURE,OWNER_LOGIN_SUCCESS,BUYER_LOGIN_SUCCESS, 
    LOGOUT_SUCCESS, GET_RESTAURANTS_SUCCESS,
    UPDATE_DETAILS_SUCCESS, SIGNUP_FAILURE, SIGNUP_SUCCESS,
    REST_REGISTERATION_SUCCESS, DELETE_ITEM_SUCCESS,
    GET_ORDERS_SUCCESS, ADD_SECTION_SUCCESS, ADD_ITEM_SUCCESS,
    UPDATE_REST_DETAILS_SUCCESS, CURRENT_REST_DETAILS_SUCCESS,
    GET_REST_DETAILS_SUCCESS, GET_REST_DETAILS_FAILURE, ADD_TO_CART_SUCCESS,
    DELETE_ORDER_ITEM_SUCCESS, GET_DELIVERY_DETAILS_SUCCESS,
    GET_PAST_ORDERS_SUCCESS, GET_PAST_ORDERS_FAILURE,
    GET_ORDER_ITEMS_SUCCESS, GET_ORDER_ITEMS_FAILURE,
    UPDATE_ORDER_SUCCESS, GET_UPCOMING_ORDERS_FAILURE,
    SEARCH_SUCCESS, GET_UPCOMING_ORDERS_SUCCESS,
    SEARCH_FAILURE, GET_OWNER_REST_DETAILS_FAILURE, GET_OWNER_REST_DETAILS_SUCCESS,
    GET_PAST_ORDERS_OWNER_SUCCESS,
    DELETE_SECTION_SUCCESS} from './../actions/actions';
    import  cloneDeep from 'lodash.clonedeep'


function app(state = {},action) {
    switch(action.type) {
        case REST_REGISTERATION_SUCCESS :
        return Object.assign({},{
            id : action.payload.restId,
            name : action.payload.name,
            cuisine : action.payload.cuisine,
            address : action.payload.address,
            zipcode : action.payload.zipcode,
            phone : action.payload.phone
        });
        case ADD_SECTION_SUCCESS :     
            return Object.assign({},state,{
            sections: action.payload
        });
        case ADD_ITEM_SUCCESS :
            const nextState = cloneDeep(state);
            const sections = Object.assign([],nextState.sections);
            const sectionId = sections.findIndex(s => s.name === action.sectionName)
            sections[sectionId].menu =[ ...sections[sectionId].menu, ...action.payload];
            nextState.sections = sections;
            return nextState;
        case DELETE_ITEM_SUCCESS : 
            const nextStateDelete = cloneDeep(state);
            const sectionsDelete =   Object.assign([],nextStateDelete.sections);
            const sectionIndex = sectionsDelete.findIndex( s => s.name === action.sectionName);
            const itemIndex =sectionsDelete[sectionIndex].menu.findIndex( i => i.name == action.payload.itemName)
            const sectionItems =  Object.assign([],sectionsDelete[sectionIndex].menu);
            sectionItems.splice(itemIndex,1);
            sectionsDelete[sectionIndex].menu = sectionItems;
            nextStateDelete.sections = sectionsDelete;
            return nextStateDelete;
        case DELETE_SECTION_SUCCESS :
            const nextStateSection = Object.assign({},state);
            const sectionsAll = Object.assign([],nextStateSection.sections);
            const sectionIndexToDelete = sectionsAll.findIndex( s => s.name === action.payload.sectionName);
            sectionsAll.splice(sectionIndexToDelete,1);
            nextStateSection.sections = sectionsAll;
            return nextStateSection;
        case CURRENT_REST_DETAILS_SUCCESS :
            return Object.assign({},state,action.payload);
        case GET_REST_DETAILS_SUCCESS : 
        return Object.assign({},state,action.payload);
        case GET_OWNER_REST_DETAILS_SUCCESS : 
            return Object.assign({},state,action.payload)
        case GET_OWNER_REST_DETAILS_FAILURE : 
            return state;
        case OWNER_LOGIN_SUCCESS:
            return Object.assign({}, state,action.payload.payload.restDetails);
        default:
            return state;
    }
}


export default app;