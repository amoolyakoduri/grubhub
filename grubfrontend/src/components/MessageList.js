import React from 'react';
import {connect} from 'react-redux';

class MessageList extends React.Component{
    constructor(){
        super()
    }

   
    render() {
        const messages = [
            {
                id : 0,
                senderId : "a",
                text : "hi"
            },
            {
                id : 1,
                senderId : "b",
                text : "hey"
            },
            {
                id : 2,
                senderId : "a",
                text : "whatsup"
            }
        ]
    
        return (
          <ul className="message-list">                 
            {messages.map(message => {
              return (
               <li key={message.id}>
                 <div>
                   {message.senderId}
                 </div>
                 <div>
                   {message.text}
                 </div>
               </li>
             )
           })}
         </ul>
        )
      }
}

const mapStateToProps = (state) => {
    const {  app } = state;
    return { app};
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageList);
