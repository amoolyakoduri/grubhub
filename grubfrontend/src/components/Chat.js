import React from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import Container from './DraggableOrders';

class Chat extends React.Component {

    constructor(props){
        super();
        // this.state = {
        //     orderId : props.location.state.orderId
        // }
    }

    render() {
        return <div class = "container" style = {{"display":"flex","flexDirection":"column", "border": "#7cd0d4", "border-style": "dashed"}}>
            For Order Id : {this.props.match.params.orderId}
            <MessageList />
            <SendMessageForm orderId = {this.props.match.params.orderId} />
            </div>
    }
}

export default Chat;