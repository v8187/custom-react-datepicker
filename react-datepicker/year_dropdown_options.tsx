import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { getYear } from "./date_utils";

function generateYears(year, noOfYear, minDate, maxDate) {
  var list = [];
  for (var i = 0; i < 2 * noOfYear + 1; i++) {
    const newYear = year + noOfYear - i;
    let isInRange = true;

    if (minDate) {
      isInRange = getYear(minDate) <= newYear;
    }

    if (maxDate && isInRange) {
      isInRange = getYear(maxDate) >= newYear;
    }

    if (isInRange) {
      list.push(newYear);
    }
  }

  return list;
}

export default class YearDropdownOptions extends React.Component {
  static propTypes = {
    minDate: Date,
    maxDate: Date,
    onCancel: ()=> any.isRequired,
    onChange: ()=> any.isRequired,
    scrollableYearDropdown: boolean,
    year: number.isRequired,
    yearDropdownItemNumber: number
  };

  constructor(props) {
    super(props);
    const { yearDropdownItemNumber, scrollableYearDropdown } = props;
    const noOfYear =
      yearDropdownItemNumber || (scrollableYearDropdown ? 10 : 5);

    this.state = {
      yearsList: generateYears(
        this.props.year,
        noOfYear,
        this.props.minDate,
        this.props.maxDate
      )
    };
  }

  renderOptions = () => {
    var selectedYear = this.props.year;
    var options = this.state.yearsList.map(year => (
      <div
        className={
          selectedYear === year
            ? "react-datepicker__year-option react-datepicker__year-option--selected_year"
            : "react-datepicker__year-option"
        }
        key={year}
        ref={year}
        onClick={this.onChange.bind(this, year)}
      >
        {selectedYear === year ? (
          <span className="react-datepicker__year-option--selected">✓</span>
        ) : (
          ""
        )}
        {year}
      </div>
    ));

    const minYear = this.props.minDate ? getYear(this.props.minDate) : null;
    const maxYear = this.props.maxDate ? getYear(this.props.maxDate) : null;

    if (!maxYear || !this.state.yearsList.find(year => year === maxYear)) {
      options.unshift(
        <div
          className="react-datepicker__year-option"
          ref={"upcoming"}
          key={"upcoming"}
          onClick={this.incrementYears}
        >
          <a className="react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-upcoming" />
        </div>
      );
    }

    if (!minYear || !this.state.yearsList.find(year => year === minYear)) {
      options.push(
        <div
          className="react-datepicker__year-option"
          ref={"previous"}
          key={"previous"}
          onClick={this.decrementYears}
        >
          <a className="react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-previous" />
        </div>
      );
    }

    return options;
  };

  onChange = year => {
    this.props.onChange(year);
  };

  handleClickOutside = () => {
    this.props.onCancel();
  };

  shiftYears = amount => {
    var years = this.state.yearsList.map(function(year) {
      return year + amount;
    });

    this.setState({
      yearsList: years
    });
  };

  incrementYears = () => {
    return this.shiftYears(1);
  };

  decrementYears = () => {
    return this.shiftYears(-1);
  };

  render() {
    let dropdownClass = classNames({
      "react-datepicker__year-dropdown": true,
      "react-datepicker__year-dropdown--scrollable": this.props
        .scrollableYearDropdown
    });

    return <div className={dropdownClass}>{this.renderOptions()}</div>;
  }
}
