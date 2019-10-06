import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux'
import { shallow, mount, render } from 'enzyme';
import {toBeInTheDocument, toHaveClass} from '@testing-library/jest-dom'

expect.extend({toBeInTheDocument, toHaveClass})
configure({ adapter: new Adapter() });

import Login from './Login';
import  configureStore from 'redux-mock-store';
const mockStore = configureStore([])

test('Check if Login Component is being rendered', ()=> {
    const initialState= {
        "isLoggedIn":false,"emailId":null,"firstName":null
    };
    const store = mockStore(initialState);
    const shallowRender = shallow(<Provider store={store}><Login /></Provider>);
    expect(shallowRender.html()).toMatch('container');
})

test('Check if Component is being rendered', ()=> {
    const initialState= {
        "isLoggedIn":false,"emailId":null,"firstName":null
    };
    const store = mockStore(initialState);
    const shallowRender = shallow(<Provider store={store}><Login /></Provider>);
    console.log(shallowRender.debug());
    shallowRender.find('input[type="text"]').simulate('change', {
        target: { value: 'hello' }
      })
      console.log(shallowRender.html());
    expect(shallowRender.html()).toMatch('container');
})
