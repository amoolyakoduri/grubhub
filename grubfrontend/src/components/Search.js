import React from 'react';
import SearchContent from './SearchContent';
import Filters from './Filters';
import './../css/Search.css';
import isBuyer from './isBuyer';
import loginCheck from './LoginCheck';

class Search extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return <div class="layout">
            <Filters />
            <SearchContent />
        </div>
    }
}
export default loginCheck(isBuyer(Search));