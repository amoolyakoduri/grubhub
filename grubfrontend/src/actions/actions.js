import { func } from "prop-types";

const OWNER_LOGIN_SUCCESS = "OWNER_LOGIN_SUCCESS";
const BUYER_LOGIN_SUCCESS = "BUYER_LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS';
const UPDATE_DETAILS_SUCCESS = 'UPDATE_DETAILS_SUCCESS';
const UPDATE_DETAILS_FAILURE = 'UPDATE_DETAILS_FAILURE';
const UPDATE_REST_DETAILS_SUCCESS = 'UPDATE_REST_DETAILS_SUCCESS';
const UPDATE_REST_DETAILS_FAILURE = 'UPDATE_REST_DETAILS_FAILURE';
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
const REST_REGISTERATION_SUCCESS = 'REST_REGISTERATION_SUCCESS';
const REST_REGISTERATION_FAILURE = 'REST_REGISTERATION_FAILURE';
const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
const GET_ORDERS_FAILURE = 'GET_ORDERS_FAILURE';
const GET_PAST_ORDERS_OWNER_FAILURE = 'GET_PAST_ORDERS_OWNER_FAILURE';
const GET_PAST_ORDERS_OWNER_SUCCESS = 'GET_PAST_ORDERS_OWNER_SUCCESS';
const ADD_SECTION_SUCCESS = 'ADD_SECTION_SUCCESS';
const ADD_SECTION_FAILURE = 'ADD_SECTION_FAILURE';
const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
const ADD_ITEM_FAILURE = 'ADD_ITEM_FAILURE';
const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
const DELETE_ITEM_FAILURE = 'DELETE_ITEM_FAILURE';
const CURRENT_REST_DETAILS_SUCCESS = 'CURRENT_REST_DETAILS_SUCCESS';
const GET_REST_DETAILS_SUCCESS = 'GET_REST_DETAILS_SUCCESS';
const GET_REST_DETAILS_FAILURE = 'GET_REST_DETAILS_FAILURE';
const ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS";
const DELETE_ORDER_ITEM_SUCCESS = 'DELETE_ORDER_ITEM_SUCCESS';
const GET_DELIVERY_DETAILS_SUCCESS = 'GET_DELIVERY_DETAILS_SUCCESS';
const GET_PAST_ORDERS_SUCCESS = 'GET_PAST_ORDERS_SUCCESS';
const GET_PAST_ORDERS_FAILURE = 'GET_PAST_ORDERS_FAILURE';
const GET_UPCOMING_ORDERS_SUCCESS = 'GET_UPCOMING_ORDERS_SUCCESS';
const GET_UPCOMING_ORDERS_FAILURE = 'GET_UPCOMING_ORDERS_FAILURE';
const GET_ORDER_ITEMS_SUCCESS = 'GET_ORDER_ITEMS_SUCCESS';
const GET_ORDER_ITEMS_FAILURE = 'GET_ORDER_ITEMS_FAILURE';
const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
const UPDATE_ORDER_FAILURE = 'UPDATE_ORDER_FAILURE';
const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
const SEARCH_FAILURE = 'SEARCH_FAILURE';
const DELETE_SECTION_SUCCESS = 'DELETE_SECTION_SUCCESS';
const DELETE_SECTION_FAILURE = 'DELETE_SECTION_FAILURE';
const GET_OWNER_REST_DETAILS_SUCCESS = 'GET_OWNER_REST_DETAILS_SUCCESS';
const GET_OWNER_REST_DETAILS_FAILURE = 'GET_OWNER_REST_DETAILS_FAILURE';
const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';

function onSendMessageSuccess(payload){
    return {
        type : SEND_MESSAGE_SUCCESS,
        payload : payload
    }
}

function onOwnerLoginSuccess(payload) {
    return {
        type : OWNER_LOGIN_SUCCESS,
        payload : payload
    }
}

function onBuyerLoginSuccess(payload) {
    return {
        type : BUYER_LOGIN_SUCCESS,
        payload:payload
    }
}

function onLoginFailure() {
    return {
        type : LOGIN_FAILURE,
        payload :null
    }
}

function onLogoutSuccess() {
    return {
        type : LOGOUT_SUCCESS,
        payload : null
    }
}

function onGetRestaurantsSuccess(restaurants) {
    return {
        type : GET_RESTAURANTS_SUCCESS,
        payload: restaurants
    }
}

function onUpdateDetailsSuccess(details){
    return {
        type : UPDATE_DETAILS_SUCCESS,
        payload : details
    }
}

function onUpdateDetailsFailure() {
    return {
        type : UPDATE_DETAILS_FAILURE,
        payload:null
    }
}

function onUpdateRestDetailsSuccess(payload) {
    return {
        type: UPDATE_REST_DETAILS_SUCCESS,
        payload:payload
    }
}

function onUpdateRestDetailsFailure() {
    return {
        type: UPDATE_REST_DETAILS_FAILURE,
        payload:null
    }
}

function onSignUpSuccess(userDetails){
    return {
        type : SIGNUP_SUCCESS,
        payload : userDetails
    }
}

function onSignUpFailure() {
    return {
        type : SIGNUP_FAILURE,
        payload : null
    }
}

function onRestRegisterationSuccess(payload){
    return {
        type : REST_REGISTERATION_SUCCESS,
        payload : payload
    }
}

function onRestRegisterationFailure(){
    return {
        type : REST_REGISTERATION_FAILURE,
        payload : null
    }
}

function onGetOrdersSuccess(payload) {
    return {
        type : GET_ORDERS_SUCCESS,
        payload : payload
    }
}

function onGetOrdersFailure() {
    return {
        type : GET_ORDERS_FAILURE,
        payload : null
    }
}

function onGetPastOrdersOwnerSuccess(payload) {
    return {
        type: GET_PAST_ORDERS_OWNER_SUCCESS,
        payload : payload
    }
}

function onGetPastOrdersOwnerFailure() {
    return {
        type: GET_PAST_ORDERS_OWNER_FAILURE,
        payload : null
    }
}

function onAddSectionSuccess(payload) {
    return {
        type : ADD_SECTION_SUCCESS,
        payload : payload
    }
}

function onAddSectionFailure() {
    return {
        type : ADD_SECTION_FAILURE,
        payload : null
    }
}

function onDeleteSectionSuccess(payload) {
    return {
        type : DELETE_SECTION_SUCCESS,
        payload : payload
    }
}

function onDeleteSectionFailure() {
    return {
        type : DELETE_SECTION_FAILURE,
        payload : null
    }
}

function onAddItemSuccess(payload, sectionName) {
    return {
        type:ADD_ITEM_SUCCESS,
        payload:payload,
        sectionName
    }
}

function onAddItemFailure() {
    return {
        type:ADD_ITEM_FAILURE,
        payload:null
    }
}

function onDeleteItemSuccess(payload,sectionName){
    return {
        type : DELETE_ITEM_SUCCESS,
        payload:payload,
        sectionName
    }
}

function onDeleteItemFailure(){
    return {
        type : DELETE_ITEM_FAILURE,
        payload:null
    }
}

function onCurrentRestDetailsSuccess(payload) {
    return {
        type : CURRENT_REST_DETAILS_SUCCESS,
        payload : payload
    }
}

function onGetRestDetailsSuccess(payload) {
    return {
        type : GET_REST_DETAILS_SUCCESS,
        payload : payload
    }
}

function onGetRestDetailsFailure() {
    return {
        type : GET_REST_DETAILS_FAILURE,
        payload: null
    }
}

function onAddToCartSuccess(payload) {
    return {
        type : ADD_TO_CART_SUCCESS,
        payload : payload
    }
}

function onDeleteOrderItemSuccess(payload) {
    return {
        type : DELETE_ORDER_ITEM_SUCCESS,
        payload : payload
    }
}

function onGetDeliveryDetailsSuccess(payload,dateString) {
    return {
        type : GET_DELIVERY_DETAILS_SUCCESS,
        payload : payload,
        dateString
    }
}

function onGetPastOrdersSuccess(payload) {
    return {
        type : GET_PAST_ORDERS_SUCCESS,
        payload : payload
    }
}

function onGetPastOrdersFailure() {
    return {
        type : GET_PAST_ORDERS_FAILURE,
        payload: null
    }
}

function onGetUpcomingOrdersSuccess(payload) {
    return {
        type : GET_UPCOMING_ORDERS_SUCCESS,
        payload : payload
    }
}

function onGetUpcomingOrdersFailure() {
    return {
        type : GET_UPCOMING_ORDERS_FAILURE,
        payload: null
    }
}

function onGetOrderItemsSuccess(payload) {
    return {
        type: GET_ORDER_ITEMS_SUCCESS,
        payload :payload
    }
}

function onGetOrderItemsFailure() {
    return {
        type: GET_ORDER_ITEMS_FAILURE,
        payload : null
    }
}

function onUpdateOrderSuccess(payload) {
    return {
        type: UPDATE_ORDER_SUCCESS,
        payload : payload
    }
}

function onUpdateOrderFailure() {
    return {
        type : UPDATE_ORDER_FAILURE,
        payload : null
    }
}

function onSearchSuccess(payload){
    return {
        type : SEARCH_SUCCESS,
        payload:payload
    }
}

function onSearchFailure() {
    return {
        type : SEARCH_FAILURE,
        payload : null
    }
}

function onGetOwnerRestDetailsSuccess(payload) {
    return {
        type : GET_OWNER_REST_DETAILS_SUCCESS,
        payload : payload
    }
}

function onGetOwnerRestDetailsFailure(){
    return {
        type : GET_OWNER_REST_DETAILS_FAILURE,
        payload : null
    }
}

export { onOwnerLoginSuccess , onBuyerLoginSuccess, onLoginFailure,
    onLogoutSuccess, onGetRestaurantsSuccess,
    onUpdateDetailsSuccess, onUpdateDetailsFailure,
    onUpdateRestDetailsSuccess, onUpdateRestDetailsFailure,
    onSignUpSuccess, onSignUpFailure,
    onRestRegisterationFailure,
    onRestRegisterationSuccess,
    onGetOrdersSuccess, onGetOrdersFailure,
    onAddSectionFailure, onAddSectionSuccess,
    onAddItemSuccess, onAddItemFailure,
    onDeleteItemFailure, onDeleteItemSuccess,
    onCurrentRestDetailsSuccess, onGetRestDetailsSuccess,
    onGetRestDetailsFailure, onAddToCartSuccess,
    onDeleteOrderItemSuccess, onGetDeliveryDetailsSuccess,
    onGetPastOrdersSuccess, onGetPastOrdersFailure,
    onGetOrderItemsFailure, onGetOrderItemsSuccess,
    onUpdateOrderFailure, onUpdateOrderSuccess,
    onSearchSuccess, onSearchFailure, onSendMessageSuccess,
    onGetUpcomingOrdersSuccess, onGetUpcomingOrdersFailure,
    onGetPastOrdersOwnerFailure, onGetPastOrdersOwnerSuccess,
    onDeleteSectionFailure, onDeleteSectionSuccess,
    onGetOwnerRestDetailsSuccess, onGetOwnerRestDetailsFailure,
    LOGIN_FAILURE, OWNER_LOGIN_SUCCESS, BUYER_LOGIN_SUCCESS,
    LOGOUT_SUCCESS, GET_RESTAURANTS_SUCCESS,
    UPDATE_DETAILS_SUCCESS, UPDATE_DETAILS_FAILURE,
    UPDATE_REST_DETAILS_SUCCESS, UPDATE_REST_DETAILS_FAILURE,
    SIGNUP_FAILURE,SIGNUP_SUCCESS,
    REST_REGISTERATION_FAILURE, SEND_MESSAGE_SUCCESS,
    REST_REGISTERATION_SUCCESS,
    GET_ORDERS_SUCCESS, GET_ORDERS_FAILURE,
    ADD_SECTION_FAILURE, ADD_SECTION_SUCCESS,
    ADD_ITEM_SUCCESS, ADD_ITEM_FAILURE,
    DELETE_ITEM_SUCCESS, DELETE_ITEM_FAILURE,
    CURRENT_REST_DETAILS_SUCCESS, ADD_TO_CART_SUCCESS,
    GET_REST_DETAILS_SUCCESS, GET_REST_DETAILS_FAILURE,
    DELETE_ORDER_ITEM_SUCCESS, GET_DELIVERY_DETAILS_SUCCESS,
    GET_PAST_ORDERS_FAILURE, GET_PAST_ORDERS_SUCCESS,
    GET_ORDER_ITEMS_FAILURE, GET_ORDER_ITEMS_SUCCESS,
    UPDATE_ORDER_FAILURE, UPDATE_ORDER_SUCCESS,
    SEARCH_FAILURE, SEARCH_SUCCESS,
    GET_PAST_ORDERS_OWNER_FAILURE, GET_PAST_ORDERS_OWNER_SUCCESS,
    GET_UPCOMING_ORDERS_FAILURE, GET_UPCOMING_ORDERS_SUCCESS,
    DELETE_SECTION_FAILURE, DELETE_SECTION_SUCCESS,
    GET_OWNER_REST_DETAILS_SUCCESS, GET_OWNER_REST_DETAILS_FAILURE }





