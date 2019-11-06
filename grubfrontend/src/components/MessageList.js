import React from 'react';
import { connect } from 'react-redux';
import { init } from './../helpers/socket';
import { onSendMessageSuccess, onMessageRecieveSuccess, onLoadInitialSocket } from './../actions/actions';
import loginCheck from './LoginCheck'

let socket;

class MessageList extends React.Component {
  constructor(props) {
    super(props)
    socket = init();
    socket.on('newmsg', function (data) {
      console.log("new msg ", data);
      if (data != null) {
        props.recieveMessageSuccessDispatch(data);
      }
    })
  }

  componentDidMount() {
    socket = init();
  }

  componentWillUnmount() {
  }


  render() {
    const chat = this.props.currentOrder.chat;
    return (<ul id="msgList">{chat.map(message => {
      return (
        <li>
          <p>{message.senderId}:</p>
          <p>{message.text}</p>
        </li>
      )
    })
    }
    </ul>)
  }
}

const mapStateToProps = (state) => {
  const { currentOrder } = state.app;
  return { currentOrder };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessageSuccessDispatch: (payload) => { dispatch(onSendMessageSuccess(payload)) },
    recieveMessageSuccessDispatch: (payload) => { dispatch(onMessageRecieveSuccess(payload)) },
    onLoadInitialSocketDispatch: (socket) => { dispatch(onLoadInitialSocket(socket)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(loginCheck(MessageList));
