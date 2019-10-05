import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Section from './Section';
import { onAddSectionSuccess, onAddSectionFailure} from './../actions/actions';
import isOwner from './isOwner';
import loginCheck from './LoginCheck';
import { AvForm, AvField } from 'availity-reactstrap-validation';



class OwnerMenu extends React.Component {
    constructor(){
        super();
        this.state = {
            modal: false,
          };
        this.toggle = this.toggle.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.create = this.create.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    changeHandler(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }  

    create() {
        this.setState(prevState => ({
            modal: !prevState.modal
          }));
        fetch('http://localhost:3003/addSection',{
            headers: {
                'Content-Type': 'application/json'
              },
              method : 'POST',
              body : JSON.stringify({ 
                  restId : this.props.restId,
                  section : this.state.sectionName
                })
        }).then( (response) => {
            return response.json();
        }).then( (myJson) => {
            console.log("created. ",myJson);
            if(myJson.payload==null) {
                this.props.addSectionFailureDispatch();
            } else {
                let arr = Object.assign([], this.props.sections);
                arr.push({name:myJson.payload.section,items:[]});
                this.props.addSectionSuccessDispatch(arr);
            }
        })
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({email: values.email, error: true});
      }

    render() {
        return <div class="container" style={{display:"flex",flexDirection:"column"}}>
            <h4>Menu:</h4>
            <div class="container" style={{display:"flex",flexDirection:"column"}}>
            {
                this.props.sections && 
                this.props.sections.map( section => {
                    return <Section key={section.name} details = {section}/>
                })
            }
            </div>
            <Button color="primary" onClick={this.toggle}>Add Section</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} >
            <ModalHeader>Add Section</ModalHeader>
            <ModalBody>
            <AvForm  onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.create}>
                <Label for = "">Section Name:</Label>  
                <AvField type="text" id="name" label="Section Name:" name="sectionName" onChange={this.changeHandler} required></AvField>
                <Button color="primary" >Create Section</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </AvForm>
            </ModalBody>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    const restId = state.restDetails.id;
    const sections = state.restDetails.sections;
    return {restId:restId,sections:sections};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addSectionSuccessDispatch : (payload) => { dispatch(onAddSectionSuccess(payload))},
        addSectionFailureDispatch : () => {dispatch(onAddSectionFailure())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(loginCheck(isOwner(OwnerMenu)));