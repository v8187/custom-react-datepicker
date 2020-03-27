import React from "react";
import PropTypes from "prop-types";

interface propTypes {
  onCancel: () => any,
  onChange: (month) => any,
  month: number,
  monthNames: any[]
};

export default class MonthDropdownOptions extends React.Component<propTypes, any> {


  renderOptions = () => {
    return this.props.monthNames.map((month, i) => (
      <div
        className={
          this.props.month === i
            ? "react-datepicker__month-option react-datepicker__month-option--selected_month"
            : "react-datepicker__month-option"
        }
        key={month}
        ref={month}
        onClick={this.onChange.bind(this, i)}
      >
        {this.props.month === i ? (
          <span className="react-datepicker__month-option--selected">✓</span>
        ) : (
            ""
          )}
        {month}
      </div>
    ));
  };

  onChange = month => this.props.onChange(month);

  handleClickOutside = () => this.props.onCancel();

  render() {
    return (
      <div className="react-datepicker__month-dropdown">
        {this.renderOptions()}
      </div>
    );
  }
}
