import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
// import DatePicker from './react-datepicker';
import MultiDatePicker from './es';

import './react-datepicker.css';
import './App.css';

interface state {
  selected: Date | null,
  selectedMultiple: Date[],
}

export default class App extends Component<any, state> {

  constructor(props: any) {
    super(props);

    this.state = {
      selected: new Date(),
      selectedMultiple: [new Date()]
    };
  }

  render() {
    return (
      <div className="App">
        <div><DatePicker
          selected={this.state.selected}
          onChange={(evt) => this.handleSelected(evt)} /></div>

        <div><MultiDatePicker
          selectedMultiple={this.state.selectedMultiple}
          monthsShown={2}
          minDate={new Date()}
          maxDate={new Date(2020, 3, 5)}
          onChange={(evt) => this.handleSelectedMultiple(evt)} /></div>
      </div>
    );
  }

  handleSelected = (date: Date[] | Date | null) => {
    console.log('handleSelected::date', date);
    this.setState({ selected: Array.isArray(date) ? date[0] : date });
  }

  handleSelectedMultiple = (dates: Date[] | Date | null) => {
    console.log('handleSelectedMultiple::dates', dates);
    this.setState({ selectedMultiple: Array.isArray(dates) ? dates : dates !== null ? [dates] : [] });
  }
}