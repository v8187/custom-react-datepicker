import React, { Component } from 'react';
// import DatePicker from 'react-datepicker';
import DatePicker from './react-datepicker'

import './react-datepicker/react-datepicker.css';
import './App.css';

export default class App extends Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = {
      selected: new Date()
    };
  }

  render() {
    return (
      <div className="App">
        <DatePicker
          selected={this.state.selected}
          monthsShown={2}
          onChange={(evt) => this.onChange(evt)} />
      </div>
    );
  }

  onChange = (date: Date | null) => {
    console.log('onChange::date', date);
    this.setState({ selected: date });
  }
}