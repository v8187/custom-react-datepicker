import React from "react";
import classnames from "classnames";
import Week from "./week";
import * as utils from "./date_utils";

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

interface propsType {
  ariaLabelPrefix?: string,
  chooseDayAriaLabelPrefix?: string,
  disabledDayAriaLabelPrefix?: string,
  disabledKeyboardNavigation?: boolean,
  day: Date,
  dayClassName?(date: Date): string | null;
  endDate?: Date,
  orderInDisplay?: number,
  excludeDates?: any[],
  filterDate?: (date: Date) => any,
  fixedHeight?: boolean,
  formatWeekNumber?(date: Date): string | number;
  highlightDates,
  includeDates?: any[],
  inline?: boolean,
  locale,
  maxDate?: Date,
  minDate?: Date,
  onDayClick?: (day, event, orderInDisplay?) => any,
  onDayMouseEnter?: (day) => any,
  onMouseLeave?: (evt?) => any,
  onWeekSelect?(
    firstDayOfWeek: Date,
    weekNumber: string | number,
    event: React.SyntheticEvent<any> | undefined,
  ): void;
  peekNextMonth?: boolean,
  preSelection?: Date,
  selected: Date,
  selectingDate?: Date,
  selectsEnd?: boolean,
  selectsStart?: boolean,
  showWeekNumbers?: boolean,
  startDate?: Date,
  setOpen?: (bool?) => any,
  shouldCloseOnSelect?: boolean,
  renderDayContents?(dayOfMonth: number, date?: Date): React.ReactNode;
  showMonthYearPicker?: boolean,
  showQuarterYearPicker?: boolean,
  handleOnKeyDown?: (evt?) => any,
  isInputFocused?: boolean,
  weekAriaLabelPrefix?: string,
  containerRef?;

};

export default class Month extends React.Component<propsType, any> {
  containerRef

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event, this.props.orderInDisplay);
    }
  };

  handleDayMouseEnter = day => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day);
    }
  };

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave();
    }
  };

  isRangeStartMonth = m => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameMonth(utils.setMonth(day, m), startDate);
  };

  isRangeStartQuarter = q => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameQuarter(utils.setQuarter(day, q), startDate);
  };

  isRangeEndMonth = m => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameMonth(utils.setMonth(day, m), endDate);
  };

  isRangeEndQuarter = q => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameQuarter(utils.setQuarter(day, q), endDate);
  };

  isWeekInMonth = startOfWeek => {
    const day = this.props.day;
    const endOfWeek = utils.addDays(startOfWeek, 6);
    return (
      utils.isSameMonth(startOfWeek, day) || utils.isSameMonth(endOfWeek, day)
    );
  };

  renderWeeks = () => {
    const weeks: any[] = [];
    var isFixedHeight = this.props.fixedHeight;
    let currentWeekStart = utils.getStartOfWeek(
      utils.getStartOfMonth(this.props.day),
      this.props.locale
    );
    let i = 0;
    let breakAfterNextPush = false;

    while (true) {
      weeks.push(
        <Week
          ariaLabelPrefix={this.props.weekAriaLabelPrefix || ''}
          chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
          disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
          key={i}
          day={currentWeekStart}
          month={utils.getMonth(this.props.day)}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          onWeekSelect={this.props.onWeekSelect}
          formatWeekNumber={this.props.formatWeekNumber}
          locale={this.props.locale}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          excludeDates={this.props.excludeDates}
          includeDates={this.props.includeDates}
          inline={this.props.inline}
          highlightDates={this.props.highlightDates}
          selectingDate={this.props.selectingDate}
          filterDate={this.props.filterDate}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
          selectsStart={this.props.selectsStart}
          selectsEnd={this.props.selectsEnd}
          showWeekNumber={this.props.showWeekNumbers}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          dayClassName={this.props.dayClassName}
          setOpen={this.props.setOpen}
          shouldCloseOnSelect={this.props.shouldCloseOnSelect}
          disabledKeyboardNavigation={this.props.disabledKeyboardNavigation}
          renderDayContents={this.props.renderDayContents}
          handleOnKeyDown={this.props.handleOnKeyDown}
          isInputFocused={this.props.isInputFocused}
          containerRef={this.props.containerRef}
        />
      );

      if (breakAfterNextPush) break;

      i++;
      currentWeekStart = utils.addWeeks(currentWeekStart, 1);

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek =
        isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
      const isNonFixedAndOutOfMonth =
        !isFixedHeight && !this.isWeekInMonth(currentWeekStart);

      if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true;
        } else {
          break;
        }
      }
    }

    return weeks;
  };

  onMonthClick = (e, m) => {
    this.handleDayClick(
      utils.getStartOfMonth(utils.setMonth(this.props.day, m)),
      e
    );
  };

  onQuarterClick = (e, q) => {
    this.handleDayClick(
      utils.getStartOfQuarter(utils.setQuarter(this.props.day, q)),
      e
    );
  };

  getMonthClassNames = m => {
    const { day, startDate, endDate, selected, minDate, maxDate } = this.props;
    return classnames(
      "react-datepicker__month-text",
      `react-datepicker__month-${m}`,
      {
        "react-datepicker__month--disabled":
          (minDate || maxDate) &&
          utils.isMonthDisabled(utils.setMonth(day, m), this.props),
        "react-datepicker__month--selected":
          utils.getMonth(day) === m &&
          utils.getYear(day) === utils.getYear(selected),
        "react-datepicker__month--in-range": utils.isMonthinRange(
          startDate,
          endDate,
          m,
          day
        ),
        "react-datepicker__month--range-start": this.isRangeStartMonth(m),
        "react-datepicker__month--range-end": this.isRangeEndMonth(m)
      }
    );
  };

  getQuarterClassNames = q => {
    const { day, startDate, endDate, selected, minDate, maxDate } = this.props;
    return classnames(
      "react-datepicker__quarter-text",
      `react-datepicker__quarter-${q}`,
      {
        "react-datepicker__quarter--disabled":
          (minDate || maxDate) &&
          utils.isQuarterDisabled(utils.setQuarter(day, q), this.props),
        "react-datepicker__quarter--selected":
          utils.getQuarter(day) === q &&
          utils.getYear(day) === utils.getYear(selected),
        "react-datepicker__quarter--in-range": utils.isQuarterInRange(
          startDate,
          endDate,
          q,
          day
        ),
        "react-datepicker__quarter--range-start": this.isRangeStartQuarter(q),
        "react-datepicker__quarter--range-end": this.isRangeEndQuarter(q)
      }
    );
  };

  renderMonths = () => {
    const months = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11]
    ];
    return months.map((month, i) => (
      <div className="react-datepicker__month-wrapper" key={i}>
        {month.map((m, j) => (
          <div
            key={j}
            onClick={ev => {
              this.onMonthClick(ev, m);
            }}
            className={this.getMonthClassNames(m)}
          >
            {utils.getMonthShortInLocale(m, this.props.locale)}
          </div>
        ))}
      </div>
    ));
  };

  renderQuarters = () => {
    const quarters = [1, 2, 3, 4];
    return (
      <div className="react-datepicker__quarter-wrapper">
        {quarters.map((q, j) => (
          <div
            key={j}
            onClick={ev => {
              this.onQuarterClick(ev, q);
            }}
            className={this.getQuarterClassNames(q)}
          >
            {utils.getQuarterShortInLocale(q, this.props.locale)}
          </div>
        ))}
      </div>
    );
  };

  getClassNames = () => {
    const {
      selectingDate,
      selectsStart,
      selectsEnd,
      showMonthYearPicker,
      showQuarterYearPicker
    } = this.props;
    return classnames(
      "react-datepicker__month",
      {
        "react-datepicker__month--selecting-range":
          selectingDate && (selectsStart || selectsEnd)
      },
      { "react-datepicker__monthPicker": showMonthYearPicker },
      { "react-datepicker__quarterPicker": showQuarterYearPicker }
    );
  };

  render() {
    const {
      showMonthYearPicker,
      showQuarterYearPicker,
      day,
      ariaLabelPrefix = "month "
    } = this.props;
    return (
      <div
        className={this.getClassNames()}
        onMouseLeave={this.handleMouseLeave}
        aria-label={`${ariaLabelPrefix} ${utils.formatDate(day, "yyyy-MM")}`}
      >
        {showMonthYearPicker
          ? this.renderMonths()
          : showQuarterYearPicker
            ? this.renderQuarters()
            : this.renderWeeks()}
      </div>
    );
  }
}