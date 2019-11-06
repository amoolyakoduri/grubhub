import React from 'react';
import { Button, Modal, Table, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { onAddItemSuccess, onAddItemFailure, onDeleteItemSuccess, onDeleteItemFailure } from './../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';


class Section extends React.Component {
  constructor() {
    super();
    this.state = {
      modal1: false,
      modal2: false
    };
    this.toggle1 = this.toggle1.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  toggle1() {
    this.setState(prevState => ({
      modal1: !prevState.modal1
    }));
  }

  toggle2() {
    this.setState(prevState => ({
      modal2: !prevState.modal2
    }));
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  create(event) {
    event.preventDefault();
    this.setState(prevState => ({
      modal1: !prevState.modal1
    }));
    var jwtToken = ls.get('jwtToken').substring(3);
    const data = new FormData();
    data.append('section', this.props.name);
    data.append('name', this.state.name);
    data.append('desc', this.state.desc);
    data.append('price', this.state.price);
    data.append('pic', this.state.pic);
    fetch('http://3.133.102.192:3003'+'/api/rest/addItem', {
      headers: {
        "Authorization": `Bearer${jwtToken}`
      },
      method: 'POST',
      body: data
    }).then((response) => {
      return response.json();
    }).then((myJson) => {
      if (myJson.success == false) {
        this.props.addItemFailureDispatch();
      } else {
        let item = [{
          name: this.state.name,
          descr: this.state.desc,
          price: this.state.price,
          pic: this.state.pic
        }];
        this.props.addItemSuccessDispatch(item, this.props.name);
      }
    })
  }

  delete() {
    var jwtToken = ls.get('jwtToken').substring(3);
    this.setState(prevState => ({
      modal2: !prevState.modal2
    }));
    fetch('http://3.133.102.192:3003'+'/api/rest/deleteItem', {
      headers: {
        "Authorization": `Bearer${jwtToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        section: this.props.name,
        name: this.state.itemName
      })
    }).then((response) => {
      return response.json();
    }).then((myJson) => {
      console.log("deleted item. ", myJson);
      if (myJson.success == false) {
        this.props.deleteItemFailureDispatch();
        console.log("item not deleted");
      } else {
        this.props.deleteItemSuccessDispatch({ itemName: this.state.itemName }, this.props.name);
      }
    })
  }

  fileHandler = (event) => {
    this.setState({ pic: event.target.files[0] });

  }

  render() {
    return <div class="container" style={{ display: "flex", flexDirection: "column" }}>
      <h4>{this.props.name}</h4>
      <Button color="primary" onClick={this.toggle1} style={{ width: "fit-content" }} dataTarget="#createItem">Add Item</Button>
      <Modal isOpen={this.state.modal1} toggle={this.toggle1} id="createItem" >
        <AvForm onValidSubmit={this.create} onInvalidSubmit={this.toggle1}>
          <ModalHeader >Add Item</ModalHeader>
          <ModalBody>
            <AvField type="text" id="name" label="Item Name:" name="name" onChange={this.changeHandler} required></AvField>
            <AvField type="text" id="desc" name="desc" label="Item Description:" onChange={this.changeHandler} required></AvField>
            <AvField type="number" min="0" label="Item Price:" id="price" name="price" onChange={this.changeHandler} required></AvField>
            <AvField type='file' id='multi' name="pic" label="Upload display picture" onChange={this.fileHandler} accept="image/*" required />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" >Create Item</Button>{' '}
            <Button color="secondary" onClick={this.toggle1} >Cancel</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
      <Table>
        <thead>
          <tr>
            <th>Pic</th>
            <th>Name</th>
            <th>Desc</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.details.menu &&
            this.props.details.menu.map(item => {
              return (<tr>
                <td><img src={"/" + item.pic} /></td>
                <td>{item.name}</td>
                <td>{item.descr}</td>
                <td>{item.price}</td>
              </tr>)
            })
          }
        </tbody>
      </Table>
      <Button color="primary" onClick={this.toggle2} style={{ width: "fit-content" }} dataTarget="#deleteItem">Delete Item</Button>
      <Modal isOpen={this.state.modal2} toggle={this.toggle2} id="deleteItem" >
        <ModalHeader >Delete Item</ModalHeader>
        <ModalBody>
          <Label for="itemName">Item Name:</Label>
          <Input type="text" min="0" id="itemName" name="itemName" onChange={this.changeHandler}></Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.delete}>Delete Item</Button>{' '}
          <Button color="secondary" onClick={this.toggle2}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Table></Table>
    </div>
  }
}

const mapStateToProps = (state, props) => {
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItemSuccessDispatch: (payload, sectionName) => { dispatch(onAddItemSuccess(payload, sectionName)) },
    addItemFailureDispatch: () => { dispatch(onAddItemFailure()) },
    deleteItemSuccessDispatch: (payload, sectionName) => { dispatch(onDeleteItemSuccess(payload, sectionName)) },
    deleteItemFailureDispatch: () => { dispatch(onDeleteItemFailure()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);