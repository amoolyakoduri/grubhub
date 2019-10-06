import React from 'react';
import Collection from './Collection';
import './../css/Orders.css'

class CollectionsContainer extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return <div >
            <div className="container">
                <h1 className="jumboTitle" style={{ textAlign: "center", color: "black" }}>Explore our collections!</h1>
            </div>
            <Collection />

        </div>
    }
}

export default CollectionsContainer;