import React from 'react';
import { Label, Button, Input } from 'reactstrap';
import './../css/Filters.css'
import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { onSearchFailure, onSearchSuccess } from './../actions/actions';

class Filters extends React.Component {

  constructor() {
    super();
    this.state = {
      restaurant: "",
      item: "",
      cuisine: "",
      error: null
    }
  };

  changeHandler = (event) => {
    let key = event.target.name;
    let value = event.target.value;
    this.setState({
      [key]: value
    }
    )
  }

  getResults = () => {
    if (this.state.restaurant === "" && this.state.item === "" && this.state.cuisine === "") {
      this.setState({
        error: "Add filters please."
      })
      return null;
    } else {
      fetch('/api/search', {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.restaurant,
          item: this.state.item,
          cuisine: this.state.cuisine
        })
      }).then((response) => {
        return response.json();
      }).then((myJson) => {
        if (myJson.payload == null) {
          this.props.getSearchFailureDispatch();
        } else {
          console.log(myJson);
          this.props.getSearchSuccessDispatch(myJson.payload);
        }
      })
    }
  }


  handleInvalidSubmit = (event, errors, values) => {
    this.setState({
      email: values.email, error: true
    })
  }

  render() {
    return <div style={{ width: "300px", backgroundColor: "#fafafa", height: "100%", display: "flex", flexDirection: "column" }}>
      <h4 className="filterTitle">Filters</h4><a href="#" >Clear all!</a>
      <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
        <AvField type="text" label="Search for a restaurant:" name="restaurant" id="restaurant" onChange={this.changeHandler} placeholder="" />
        <AvField type="text" label="Search for an item:" name="item" id="item" onChange={this.changeHandler} placeholder="" />
        <AvField type="text" label="Search for a cuisine:" name="cuisine" id="cuisine" onChange={this.changeHandler} placeholder="" />
        <Button onClick={this.getResults}>Search</Button>
        {this.state.error && <div style={{ color: "red" }}>{this.state.error}</div>}
      </AvForm>
    </div>

  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    getSearchSuccessDispatch: (payload) => { dispatch(onSearchSuccess(payload)) },
    getSearchFailureDispatch: () => { dispatch(onSearchFailure()) }
  }
}

export default connect(null, mapDispatchToProps)(Filters);