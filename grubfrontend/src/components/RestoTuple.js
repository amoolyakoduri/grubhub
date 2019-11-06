import React from 'react';
import './../css/RestoTuple.css'

class RestoTuple extends React.Component {

    constructor() {
        super();
    }

    render() {
        var details = this.props.details;
        return <div>
            <div class="tuple">
                <div >
                    <img style={{ width: "250px" }} src={'/' + details.displayPic} />
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