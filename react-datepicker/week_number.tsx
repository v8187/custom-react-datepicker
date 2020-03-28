// @flow
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

interface propTypes {
  weekNumber: number;
  onClick?: (event?) => any;
  ariaLabelPrefix?: string
};

export default class WeekNumber extends React.Component<propTypes> {


  handleClick = (event: any) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    const { weekNumber, ariaLabelPrefix = "week ", onClick } = this.props;
    const weekNumberClasses = {
      "react-datepicker__week-number": true,
      "react-datepicker__week-number--clickable": !!onClick
    };
    return (
      <div
        className={classnames(weekNumberClasses)}
        aria-label={`${ariaLabelPrefix} ${this.props.weekNumber}`}
        onClick={this.handleClick}
      >
        {weekNumber}
      </div>
    );
  }
}
