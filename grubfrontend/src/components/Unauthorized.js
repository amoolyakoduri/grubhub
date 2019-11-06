import React from 'react';

class Unauthorized extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <h3>Sorry, you are unauthorized to view this page.</h3>
    }
}

export default Unauthorized;