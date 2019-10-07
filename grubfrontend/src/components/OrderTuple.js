import React from 'react';
import pic from './../grub.png';

class OrderTuple extends React.Component {
    constructor() {
        super();
    }

    render() {
        var details = this.props.details;
        return <div >
            <div >
                <img src={'/'+details.displayPic}  style={{width:"250px"}} />
            </div>
            <div>
                <h5> {details.restName}</h5>
                Amount : {details.amt} <br />
            </div>
            <hr />
        </div>
    }
}

export default OrderTuple;