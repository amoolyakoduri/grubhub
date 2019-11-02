import React from 'react';
import {message} from './../helpers/socket';
import {connect} from 'react-redux';

class SendMessageForm extends React.Component {

  constructor(){
    super();
    this.state = {
      msg : ""
    }
  }

  send = (event) => {
    event.preventDefault();
    var payload = {
      senderId : this.props.app.emailId,
      msg : this.state.msg,
      orderId : this.props.orderId,
    }
    if(this.state.msg!="")
    message(payload);
  }

  handleMessage = (event) => {
    this.setState({msg:event.target.value});
  }

    render() {
      return (
        <form
          className="send-message-form">
          <input style={{width: "-webkit-fill-available"}}
            placeholder="Type your message and hit ENTER"
            type="text" onChange={this.handleMessage}/>
            <button  style = {{color:"blue"}} onClick={this.send} >send</button>
        </form>
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

export default connect(mapStateToProps,mapDispatchToProps)(SendMessageForm);