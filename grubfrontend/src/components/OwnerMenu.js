import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Section from './Section';
import { onAddSectionSuccess, onAddSectionFailure, onDeleteSectionSuccess, onDeleteSectionFailure } from './../actions/actions';
import isOwner from './isOwner';
import loginCheck from './LoginCheck';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ls from 'local-storage';
import { stat } from 'fs';



class OwnerMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            modal1: false,
            modal2:false
        };
        this.toggle1 = this.toggle1.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.create = this.create.bind(this);
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

    create() {
        var jwtToken = ls.get('jwtToken').substring(3);
        this.setState(prevState => ({
            modal1: !prevState.modal1
        }));
        fetch('/api/addSection', {
            headers: {
                "Authorization" : `Bearer${jwtToken}`,
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({
                section: this.state.sectionName
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false) {
                this.props.addSectionFailureDispatch();
            } else {
                let sections = Object.assign([], this.props.sections);
                sections.push({ name: this.state.sectionName, menu: [] });
                this.props.addSectionSuccessDispatch(sections);
            }
        })
    }

    delete = ()=> {
        var jwtToken = ls.get('jwtToken').substring(3);
        this.setState(prevState => ({
            modal2: !prevState.modal2
        }));
        fetch('/api/deleteSection', {
            headers: {
                "Authorization" : `Bearer${jwtToken}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                section: this.state.sectionName
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            console.log("created. ", myJson);
            if (myJson.success == false) {
                this.props.deleteSectionFailureDispatch();
            } else {
                this.props.deleteSectionSuccessDispatch({sectionName:this.state.sectionName});
            }
        })
    }

    handleInvalidSubmit = (event, errors, values) => {
        this.setState({ email: values.email, error: true });
    }

    render() {
        return <div class="container" style={{ display: "flex", flexDirection: "column" }}>
            <h4>Menu:</h4>
            <div class="container" style={{ display: "flex", flexDirection: "column" }}>
                {
                    this.props.sections && 
                    this.props.sections.map(section => {
                        return <Section name={section.name} details = {section} />
                    })
                }
            </div>
            <Button color="primary" style={{ width: "fit-content" }} onClick={this.toggle1}>Add Section</Button>
            <Modal isOpen={this.state.modal1} toggle={this.toggle1} >
                <ModalHeader>Add Section</ModalHeader>
                <ModalBody>
                    <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.create}>
                        <AvField type="text" id="name" label="Section Name:" name="sectionName" onChange={this.changeHandler} required></AvField>
                        <Button color="primary" >Create Section</Button>{' '}
                        <Button color="secondary" onClick={this.toggle1}>Cancel</Button>
                    </AvForm>
                </ModalBody>
            </Modal>
            <Button color="primary" style={{ width: "fit-content" }} onClick={this.toggle2}>Delete Section</Button>
            <Modal isOpen={this.state.modal2} toggle={this.toggle2} >
                <ModalHeader>Delete Section</ModalHeader>
                <ModalBody>
                    <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.delete}>
                        <AvField type="text" id="name" label="Section Name:" name="sectionName" onChange={this.changeHandler} required></AvField>
                        <Button color="primary" >Delete Section</Button>{' '}
                        <Button color="secondary" onClick={this.toggle2}>Cancel</Button>
                    </AvForm>
                </ModalBody>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    const sections = state.restDetails && state.restDetails.sections;
    return {  sections};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addSectionSuccessDispatch: (payload) => { dispatch(onAddSectionSuccess(payload)) },
        addSectionFailureDispatch: () => { dispatch(onAddSectionFailure()) },
        deleteSectionSuccessDispatch : (payload) => { dispatch(onDeleteSectionSuccess(payload))},
        deleteSectionFailureDispatch : () => { dispatch(onDeleteSectionFailure())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerMenu)//(loginCheck(isOwner(OwnerMenu)));