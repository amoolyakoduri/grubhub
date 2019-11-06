import React from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import { connect } from 'react-redux';

class Chat extends React.Component {

    constructor(props){
        super();

    }

    render() {
        return <div class = "container" style = {{"display":"flex","flexDirection":"column", "border": "#7cd0d4", "border-style": "dashed"}}>
            For Order Id : {this.props.currentOrder._id}
            <MessageList />
            <SendMessageForm />
            </div>
    }
}
const mapStateToProps = (state) => {
    const { currentOrder} = state.app;
    return {currentOrder};
}

export default connect(mapStateToProps)(Chat);