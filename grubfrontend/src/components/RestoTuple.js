import React from 'react';
import './../css/RestoTuple.css'
import pic from './../grub.png';

class RestoTuple extends React.Component {

    constructor() {
        super();
    }

    render() {
        var details = this.props.details;
        return <div>
            <div class="tuple">
                <div >
                <img src = {'/'+details.displayPic} />
                </div>
                <div>
                <h5> {details.name}</h5>
                {details.cuisine}
                </div>
            </div>
        <hr />
        </div>
    }
}

export default RestoTuple;