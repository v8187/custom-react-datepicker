import React from "react";
import PropTypes from "prop-types";
import Day from "./day";
import WeekNumber from "./week_number";
import * as utils from "./date_utils";

interface propTypes {
  ariaLabelPrefix?: string;
  disabledKeyboardNavigation?: boolean;
  day: Date;
  dayClassName?: (day) => any;
  disabledDayAriaLabelPrefix?: string;
  chooseDayAriaLabelPrefix?: string;
  endDate?: Date;
  excludeDates?: any[];
  filterDate?: (date) => any;
  formatWeekNumber?: (date) => any;
  highlightDates;
  includeDates?: any[];
  inline?: boolean;
  locale;
  maxDate?: Date;
  minDate?: Date;
  month?: number;
  onDayClick?: (day, evt) => any;
  onDayMouseEnter?: (day) => any;
  onWeekSelect?: (day, weekNumber, event) => any;
  preSelection?: Date;
  selected?: Date;
  selectingDate?: Date;
  selectsEnd?: boolean;
  selectsStart?: boolean;
  showWeekNumber?: boolean;
  startDate?: Date;
  setOpen?: (bool) => any;
  shouldCloseOnSelect?: boolean;
  renderDayContents?: (content) => any;
  handleOnKeyDown?: (evt) => any;
  isInputFocused?: boolean;
  containerRef?;
};

export default class Week extends React.Component<propTypes, any> {
  static get defaultProps() {
    return {
      shouldCloseOnSelect: true
    };
  }


  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  handleDayMouseEnter = day => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day);
    }
  };

  handleWeekClick = (day, weekNumber, event) => {
    if (typeof this.props.onWeekSelect === "function") {
      this.props.onWeekSelect(day, weekNumber, event);
    }
    if (this.props.shouldCloseOnSelect) {
      this.props.setOpen && this.props.setOpen(false);
    }
  };

  formatWeekNumber = date => {
    if (this.props.formatWeekNumber) {
      return this.props.formatWeekNumber(date);
    }
    return utils.getWeek(date, this.props.locale);
  };

  renderDays = () => {
    const startOfWeek = utils.getStartOfWeek(this.props.day, this.props.locale);
    const days: any[] = [];
    const weekNumber = this.formatWeekNumber(startOfWeek);
    if (this.props.showWeekNumber) {
      const onClickAction = this.props.onWeekSelect
        ? this.handleWeekClick.bind(this, startOfWeek, weekNumber)
        : undefined;
      days.push(
        <WeekNumber
          key="W"
          weekNumber={weekNumber}
          onClick={onClickAction}
          ariaLabelPrefix={this.props.ariaLabelPrefix}
        />
      );
    }
    return days.concat(
      [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const day = utils.addDays(startOfWeek, offset);
        return (
          <Day
            ariaLabelPrefixWhenEnabled={this.props.chooseDayAriaLabelPrefix}
            ariaLabelPrefixWhenDisabled={this.props.disabledDayAriaLabelPrefix}
            key={day.valueOf()}
            day={day}
            month={this.props.month}
            onClick={this.handleDayClick.bind(this, day)}
            onMouseEnter={this.handleDayMouseEnter.bind(this, day)}
            excludeDates={this.props.excludeDates}
                       inline={this.props.inline}
            highlightDates={this.props.highlightDates}
            selectingDate={this.props.selectingDate}
            filterDate={this.props.filterDate}
            preSelection={this.props.preSelection}
            selected={this.props.selected}
            selectsStart={this.props.selectsStart}
            selectsEnd={this.props.selectsEnd}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            dayClassName={this.props.dayClassName}
            renderDayContents={this.props.renderDayContents}
            disabledKeyboardNavigation={this.props.disabledKeyboardNavigation}
            handleOnKeyDown={this.props.handleOnKeyDown}
            isInputFocused={this.props.isInputFocused}
            containerRef={this.props.containerRef}
          />
        );
      })
    );
  };

  render() {
    return <div className="react-datepicker__week">{this.renderDays()}</div>;
  }
}
