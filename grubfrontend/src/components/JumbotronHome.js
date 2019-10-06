import React from 'react';
import {
  Jumbotron, Button, InputGroupAddon,
  Nav, NavItem, NavLink,
} from 'reactstrap';
import pic from './../grub.png';
import './../css/JumbotronHome.css'
import { withRouter } from 'react-router-dom';


class JumbotronHome extends React.Component {
  constructor() {
    super();
  }

  search = (event) => {
    event.preventDefault();
    this.props.history.push("/search");
  }

  render() {
    return <Jumbotron className="jumbotron" style={{ backgroundImage: { pic }, backgroundSize: "100%" }}>
      <h1 className="jumboTitle" style={{ textAlign: "center" }}>Who delivers in your neighbuorhood?</h1>
      <div className="container">
        <Button onClick={this.search} >Find Food!</Button></div>
    </Jumbotron>
  }
}

export default withRouter(JumbotronHome);