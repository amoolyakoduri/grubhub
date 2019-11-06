import React from 'react';
import { message } from './../helpers/socket';
import { connect } from 'react-redux';
import { onSendMessageSuccess } from './../actions/actions';

class SendMessageForm extends React.Component {

  constructor() {
    super();
    this.state = {
      msg: ""
    }
  }


  send = (event) => {
    event.preventDefault();
    var payload = {
      senderId: this.props.emailId,
      text: this.state.msg,
      orderId: this.props.currentOrder._id,
    }
    if (this.state.msg != "")
      message(payload);
  }


  componentDidMount() {

  }

  handleMessage = (event) => {
    this.setState({ msg: event.target.value });
  }

  render() {
    return (
      <form
        className="send-message-form">
        <input style={{ width: "-webkit-fill-available" }}
          placeholder="Type your message and hit ENTER"
          type="text" onChange={this.handleMessage} />
        <button style={{ color: "blue" }} onClick={this.send} >send</button>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  const { currentOrder, emailId } = state.app;
  return { currentOrder, emailId };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessageSuccessDispatch: (payload) => { dispatch(onSendMessageSuccess(payload)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendMessageForm);