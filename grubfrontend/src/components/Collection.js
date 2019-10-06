import React from 'react';
import './../css/Collection.css'
import { Button } from 'reactstrap'

class Collection extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div class="card cards bg-dark text-white">
            <img src="..." class="card-img" alt="..." />
            <div class="card-img-overlay">
            </div>
        </div>
    }
}

export default Collection;