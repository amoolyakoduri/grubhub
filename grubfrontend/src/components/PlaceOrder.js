import React from 'react';
import pic from './../grub.png';
import { connect } from 'react-redux';
import { onGetRestDetailsSuccess, onGetRestDetailsFailure } from './../actions/actions';
import SectionView from './SectionView';
import Cart from './Cart';
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck';
import ls from 'local-storage';


class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var jwtToken = ls.get('jwtToken').substring(3);
        fetch('/api/getRestDetailsByRestName/' + this.props.restDetails.name, {
            method: 'GET',
            headers: {
                "Authorization" : `Bearer${jwtToken}`,
                },
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            if (myJson.success == false)
                this.props.getRestDetailsFailureDispatch();
            else
                this.props.getRestDetailsSuccessDispatch(myJson.payload);
        })
    }

    render() {
        return <div style={{ display: "flex", flexDirection: "row" }}>
            <div class="container" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div>
                        <img src={pic} />
                    </div>
                    <h3>{this.props.restDetails && this.props.restDetails.name}</h3>
                </div>
                {this.props.restDetails && this.props.restDetails.sections &&
                    this.props.restDetails.sections.map(section => {
                        return section.menu.length != 0 ? <SectionView details={section} /> : null
                    })
                }
            </div>
            <Cart />
        </div>
    }
}

const mapStateToProps = (state) => {
    return { restDetails: state.restDetails, cart: state.cart }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getRestDetailsSuccessDispatch: (payload) => { dispatch(onGetRestDetailsSuccess(payload)) },
        getRestDetailsFailureDispatch: () => { dispatch(onGetRestDetailsFailure()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder)//(loginCheck(isBuyer(PlaceOrder)));