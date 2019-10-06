import React from 'react';
import { Button, Modal, Table, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { onAddItemSuccess, onAddItemFailure, onDeleteItemSuccess, onDeleteItemFailure} from './../actions/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';

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
            [event.target.name] : event.target.value
        })
    } 

    create() {
        this.setState(prevState => ({
            modal1: !prevState.modal1
          }));
        fetch('/addItem',{
            headers: {
                'Content-Type': 'application/json'
              },
              method : 'POST',
              body : JSON.stringify({ 
                  restId : this.props.restId,
                  section : this.props.details.name,
                  name : this.state.name,
                  desc : this.state.desc,
                  price : this.state.price,
                })
        }).then( (response) => {
            return response.json();
        }).then( (myJson) => {
            console.log("created item. ",myJson);
            if(myJson.payload==null){
              this.props.addItemFailureDispatch();
            } else {
              //let arr = Object.assign([], this.props.items);
              //arr.push({name:myJson.payload.item,descr:myJson.payload.descr,price:myJson.payload.price,id:myJson.payload.id});
              let arr = [{name:myJson.payload.item,descr:myJson.payload.descr,price:myJson.payload.price,id:myJson.payload.id}];
              this.props.addItemSuccessDispatch(arr, this.props.details.name);
            }
        })
    }

    delete() {
      this.setState(prevState => ({
          modal2: !prevState.modal2
        }));
      fetch('/deleteItem',{
          headers: {
              'Content-Type': 'application/json'
            },
            method : 'POST',
            body : JSON.stringify({ 
                restId : this.props.restId,
                section : this.props.details.name,
                itemId : this.state.itemId
              })
      }).then( (response) => {
          return response.json();
      }).then( (myJson) => {
          console.log("deleted item. ",myJson);
          if(myJson.payload==null){
            this.props.deleteItemFailureDispatch();
            console.log("item not deleted");
          } else {
            this.props.deleteItemSuccessDispatch({itemId:myJson.payload.itemId}, this.props.details.name);
          }
      })
  }

    render() {
        return <div class="container" style = {{ display:"flex",flexDirection:"column"}}>
            <h4>{this.props.details.name}</h4>
            <Button color="primary" onClick={this.toggle1} style={{width:"fit-content"}} dataTarget="#createItem">Add Item</Button>
            <Modal isOpen={this.state.modal1} toggle={this.toggle1} id="createItem" >
            <AvForm onValidSubmit={this.create} onInvalidSubmit = {this.toggle1}>
          <ModalHeader >Add Item</ModalHeader>
          <ModalBody>
              <AvField type="text" id="name" label="Item Name:" name="name" onChange={this.changeHandler} required></AvField>
              <AvField type="text" id="desc" name="desc" label="Item Description:" onChange={this.changeHandler} required></AvField>
              <AvField type="number" min="0" label="Item Price:" id="price" name="price" onChange={this.changeHandler} required></AvField>
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
            <th>Item Id</th>
            <th>Name</th>
            <th>Desc</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
            {
                this.props.details.items && 
                this.props.details.items.map( item => {
                    return (<tr>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.descr}</td>
                        <td>{item.price}</td>
                        </tr>)
                })
            }
        </tbody>
      </Table>
      <Button color="primary" onClick={this.toggle2} style={{width:"fit-content"}} dataTarget="#deleteItem">Delete Item</Button>
            <Modal isOpen={this.state.modal2} toggle={this.toggle2} id="deleteItem" >
          <ModalHeader >Delete Item</ModalHeader>
          <ModalBody>
              <Label for = "itemId">Item Id:</Label> 
              <Input type="number" min="0" id="itemId" name="itemId" onChange={this.changeHandler}></Input>
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

const mapStateToProps = (state, ownProps) => {
    const sectionName = ownProps.details.name;
    const restId = state.restDetails.id;
    const items = state.restDetails.sections.find(s=> s.name === sectionName).items;
    return {restId: restId,items:items};
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItemSuccessDispatch : (payload, sectionName) => { dispatch(onAddItemSuccess(payload, sectionName))},
    addItemFailureDispatch : () => { dispatch(onAddItemFailure())},
    deleteItemSuccessDispatch : (payload,sectionName) => { dispatch(onDeleteItemSuccess(payload,sectionName))},
    deleteItemFailureDispatch : () => { dispatch(onDeleteItemFailure())}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Section);