import YearDropdown from "./year_dropdown";
import MonthDropdown from "./month_dropdown";
import MonthYearDropdown from "./month_year_dropdown";
import Month from "./month";
import Time from "./time";
import InputTime from "./inputTime";
import React from "react";
import classnames from "classnames";
import { ReactDatePickerProps } from './index.d';
import CalendarContainer from "./calendar_container";
import {
  newDate,
  setMonth,
  getMonth,
  addMonths,
  subMonths,
  getStartOfWeek,
  getStartOfToday,
  addDays,
  formatDate,
  setYear,
  getYear,
  isBefore,
  addYears,
  subYears,
  isAfter,
  getFormattedWeekdayInLocale,
  getWeekdayShortInLocale,
  getWeekdayMinInLocale,
  isSameDay,
  monthDisabledBefore,
  monthDisabledAfter,
  yearDisabledBefore,
  yearDisabledAfter,
  getEffectiveMinDate,
  getEffectiveMaxDate,
  addZero
} from "./date_utils";

const DROPDOWN_FOCUS_CLASSNAMES = [
  "react-datepicker__year-select",
  "react-datepicker__month-select",
  "react-datepicker__month-year-select"
];

const isDropdownSelect = (element) => {
  const classNames = (element.className || "").split(/\s+/);
  return DROPDOWN_FOCUS_CLASSNAMES.some(
    testClassname => classNames.indexOf(testClassname) >= 0
  );
};

export default class Calendar extends React.Component<ReactDatePickerProps, any> {
  static get defaultProps() {
    return {
      onDropdownFocus: () => { },
      monthsShown: 1,
      monthSelectedIn: 0,
      forceShowMonthNavigation: false,
      timeCaption: "Time",
      previousYearButtonLabel: "Previous Year",
      nextYearButtonLabel: "Next Year",
      previousMonthButtonLabel: "Previous Month",
      nextMonthButtonLabel: "Next Month",
      customTimeInput: null
    };
  }

  containerRef;
  assignMonthContainer;
  monthContainer;

  constructor(props) {
    super(props);

    this.containerRef = React.createRef();

    this.state = {
      date: this.getDateInView(),
      selectingDate: null,
      monthContainer: null
    };
  }

  componentDidMount() {
    // monthContainer height is needed in time component
    // to determine the height for the ul in the time component
    // setState here so height is given after final component
    // layout is rendered
    if (this.props.showTimeSelect) {
      this.assignMonthContainer = (() => {
        this.setState({ monthContainer: this.monthContainer });
      })();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.preSelection &&
      !isSameDay(this.props.preSelection, prevProps.preSelection)
    ) {
      this.setState({
        date: this.props.preSelection
      });
    } else if (
      this.props.openToDate &&
      !isSameDay(this.props.openToDate, prevProps.openToDate)
    ) {
      this.setState({
        date: this.props.openToDate
      });
    }
  }

  handleClickOutside = event => {
    this.props.onClickOutside && this.props.onClickOutside(event);
  };

  setClickOutsideRef = () => {
    return this.containerRef.current;
  };

  handleDropdownFocus = event => {
    if (isDropdownSelect(event.target) && this.props.onDropdownFocus) {
      this.props.onDropdownFocus(event);
    }
  };

  getDateInView = () => {
    const { preSelection, selected, openToDate } = this.props;
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const current = newDate();
    const initialDate = openToDate || selected || preSelection;
    if (initialDate) {
      return initialDate;
    } else {
      if (minDate && current && isBefore(current, minDate)) {
        return minDate;
      } else if (maxDate && current && isAfter(current, maxDate)) {
        return maxDate;
      }
    }
    return current;
  };

  increaseMonth = () => {
    this.setState(
      ({ date }) => ({
        date: addMonths(date, 1)
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  decreaseMonth = () => {
    this.setState(
      ({ date }) => ({
        date: subMonths(date, 1)
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  handleDayClick = (day, event, monthSelectedIn) =>
    this.props.onSelect && this.props.onSelect(day, event, monthSelectedIn);

  handleDayMouseEnter = day => {
    this.setState({ selectingDate: day });
    this.props.onDayMouseEnter && this.props.onDayMouseEnter(day);
  };

  handleMonthMouseLeave = () => {
    this.setState({ selectingDate: null });
    this.props.onMonthMouseLeave && this.props.onMonthMouseLeave();
  };

  handleYearChange = date => {
    if (this.props.onYearChange) {
      this.props.onYearChange(date);
    }
  };

  handleMonthChange = date => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
    }
    if (this.props.adjustDateOnChange) {
      if (this.props.onSelect) {
        this.props.onSelect(date);
      }
      if (this.props.setOpen) {
        this.props.setOpen(true);
      }
    }

    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthYearChange = date => {
    this.handleYearChange(date);
    this.handleMonthChange(date);
  };

  changeYear = year => {
    this.setState(
      ({ date }) => ({
        date: setYear(date, year)
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  changeMonth = month => {
    this.setState(
      ({ date }) => ({
        date: setMonth(date, month)
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  changeMonthYear = monthYear => {
    this.setState(
      ({ date }) => ({
        date: setYear(setMonth(date, getMonth(monthYear)), getYear(monthYear))
      }),
      () => this.handleMonthYearChange(this.state.date)
    );
  };

  header = (date = this.state.date) => {
    const startOfWeek = getStartOfWeek(date, this.props.locale);
    const dayNames: any[] = [];
    if (this.props.showWeekNumbers) {
      dayNames.push(
        <div key="W" className="react-datepicker__day-name">
          {this.props.weekLabel || "#"}
        </div>
      );
    }
    return dayNames.concat(
      [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const day = addDays(startOfWeek, offset);
        const weekDayName = this.formatWeekday(day, this.props.locale);
        return (
          <div key={offset} className="react-datepicker__day-name">
            {weekDayName}
          </div>
        );
      })
    );
  };

  formatWeekday = (day, locale) => {
    if (this.props.formatWeekDay) {
      return getFormattedWeekdayInLocale(day, this.props.formatWeekDay, locale);
    }
    return this.props.useWeekdaysShort
      ? getWeekdayShortInLocale(day, locale)
      : getWeekdayMinInLocale(day, locale);
  };

  decreaseYear = () => {
    this.setState(
      ({ date }) => ({
        date: subYears(date, 1)
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  renderPreviousButton = () => {
    if (this.props.renderCustomHeader) {
      return;
    }

    const allPrevDaysDisabled = this.props.showMonthYearPicker
      ? yearDisabledBefore(this.state.date, this.props)
      : monthDisabledBefore(this.state.date, this.props);

    if (
      (!this.props.forceShowMonthNavigation &&
        !this.props.showDisabledMonthNavigation &&
        allPrevDaysDisabled) ||
      this.props.showTimeSelectOnly
    ) {
      return;
    }

    const classes = [
      "react-datepicker__navigation",
      "react-datepicker__navigation--previous"
    ];

    let clickHandler = this.decreaseMonth;

    if (this.props.showMonthYearPicker || this.props.showQuarterYearPicker) {
      clickHandler = this.decreaseYear;
    }

    if (allPrevDaysDisabled && this.props.showDisabledMonthNavigation) {
      classes.push("react-datepicker__navigation--previous--disabled");
      clickHandler = (evt?) => { };
    }

    const isForYear =
      this.props.showMonthYearPicker || this.props.showQuarterYearPicker;

    const {
      previousMonthAriaLabel = "Previous Month",
      previousYearAriaLabel = "Previous Year"
    } = this.props;

    return (
      <button
        type="button"
        className={classes.join(" ")}
        onClick={clickHandler}
        aria-label={isForYear ? previousYearAriaLabel : previousMonthAriaLabel}
      >
        {isForYear
          ? this.props.previousYearButtonLabel
          : this.props.previousMonthButtonLabel}
      </button>
    );
  };

  increaseYear = () => {
    this.setState(
      ({ date }) => ({
        date: addYears(date, 1)
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  renderNextButton = () => {
    if (this.props.renderCustomHeader) {
      return;
    }

    const allNextDaysDisabled = this.props.showMonthYearPicker
      ? yearDisabledAfter(this.state.date, this.props)
      : monthDisabledAfter(this.state.date, this.props);

    if (
      (!this.props.forceShowMonthNavigation &&
        !this.props.showDisabledMonthNavigation &&
        allNextDaysDisabled) ||
      this.props.showTimeSelectOnly
    ) {
      return;
    }

    const classes = [
      "react-datepicker__navigation",
      "react-datepicker__navigation--next"
    ];
    if (this.props.showTimeSelect) {
      classes.push("react-datepicker__navigation--next--with-time");
    }
    if (this.props.todayButton) {
      classes.push("react-datepicker__navigation--next--with-today-button");
    }

    let clickHandler = this.increaseMonth;

    if (this.props.showMonthYearPicker || this.props.showQuarterYearPicker) {
      clickHandler = this.increaseYear;
    }

    if (allNextDaysDisabled && this.props.showDisabledMonthNavigation) {
      classes.push("react-datepicker__navigation--next--disabled");
      clickHandler = (evt?) => { };
    }

    const isForYear =
      this.props.showMonthYearPicker || this.props.showQuarterYearPicker;

    const {
      nextMonthAriaLabel = "Next Month",
      nextYearAriaLabel = "Next Year"
    } = this.props;

    return (
      <button
        type="button"
        className={classes.join(" ")}
        onClick={clickHandler}
        aria-label={isForYear ? nextYearAriaLabel : nextMonthAriaLabel}
      >
        {isForYear
          ? this.props.nextYearButtonLabel
          : this.props.nextMonthButtonLabel}
      </button>
    );
  };

  renderCurrentMonth = (date = this.state.date) => {
    const classes = ["react-datepicker__current-month"];

    if (this.props.showYearDropdown) {
      classes.push("react-datepicker__current-month--hasYearDropdown");
    }
    if (this.props.showMonthDropdown) {
      classes.push("react-datepicker__current-month--hasMonthDropdown");
    }
    if (this.props.showMonthYearDropdown) {
      classes.push("react-datepicker__current-month--hasMonthYearDropdown");
    }
    return (
      <div className={classes.join(" ")}>
        {formatDate(date, this.props.dateFormat, this.props.locale)}
      </div>
    );
  };

  renderYearDropdown = (overrideHide = false) => {
    if (!this.props.showYearDropdown || overrideHide) {
      return;
    }
    return (
      <YearDropdown
        adjustDateOnChange={this.props.adjustDateOnChange}
        date={this.state.date}
        onSelect={this.props.onSelect}
        setOpen={this.props.setOpen}
        dropdownMode={this.props.dropdownMode}
        onChange={this.changeYear}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        year={getYear(this.state.date)}
        scrollableYearDropdown={this.props.scrollableYearDropdown}
        yearDropdownItemNumber={this.props.yearDropdownItemNumber}
      />
    );
  };

  renderMonthDropdown = (overrideHide = false) => {
    if (!this.props.showMonthDropdown || overrideHide) {
      return;
    }
    return (
      <MonthDropdown
        dropdownMode={this.props.dropdownMode}
        locale={this.props.locale}
        onChange={this.changeMonth}
        month={getMonth(this.state.date)}
        useShortMonthInDropdown={this.props.useShortMonthInDropdown}
      />
    );
  };

  renderMonthYearDropdown = (overrideHide = false) => {
    if (!this.props.showMonthYearDropdown || overrideHide) {
      return;
    }
    return (
      <MonthYearDropdown
        dropdownMode={this.props.dropdownMode}
        locale={this.props.locale}
        dateFormat={this.props.dateFormat}
        onChange={this.changeMonthYear}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        date={this.state.date}
        scrollableMonthYearDropdown={this.props.scrollableMonthYearDropdown}
      />
    );
  };

  renderTodayButton = () => {
    if (!this.props.todayButton || this.props.showTimeSelectOnly) {
      return;
    }
    return (
      <div
        className="react-datepicker__today-button"
        onClick={e => {
          this.props.onSelect &&
            this.props.onSelect(getStartOfToday(), e)
        }}
      >
        {this.props.todayButton}
      </div>
    );
  };

  renderDefaultHeader = ({ monthDate, i }) => (
    <div className="react-datepicker__header">
      {this.renderCurrentMonth(monthDate)}
      <div
        className={`react-datepicker__header__dropdown react-datepicker__header__dropdown--${this.props.dropdownMode}`}
        onFocus={this.handleDropdownFocus}
      >
        {this.renderMonthDropdown(i !== 0)}
        {this.renderMonthYearDropdown(i !== 0)}
        {this.renderYearDropdown(i !== 0)}
      </div>
      <div className="react-datepicker__day-names">
        {this.header(monthDate)}
      </div>
    </div>
  );

  renderCustomHeader = ({ monthDate, i }) => {
    if (i !== 0) {
      return null;
    }

    const prevMonthButtonDisabled = monthDisabledBefore(
      this.state.date,
      this.props
    );

    const nextMonthButtonDisabled = monthDisabledAfter(
      this.state.date,
      this.props
    );

    const prevYearButtonDisabled = yearDisabledBefore(
      this.state.date,
      this.props
    );

    const nextYearButtonDisabled = yearDisabledAfter(
      this.state.date,
      this.props
    );

    return (
      <div
        className="react-datepicker__header react-datepicker__header--custom"
        onFocus={this.props.onDropdownFocus || ((evt) => { })}
      >
        {
          this.props.renderCustomHeader && this.props.renderCustomHeader({
            ...this.state,
            date: this.state.date,
            changeMonth: this.changeMonth,
            changeYear: this.changeYear,
            decreaseMonth: this.decreaseMonth,
            increaseMonth: this.increaseMonth,
            decreaseYear: this.decreaseYear,
            increaseYear: this.increaseYear,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            prevYearButtonDisabled,
            nextYearButtonDisabled
          })
        }
        < div className="react-datepicker__day-names" >
          {this.header(monthDate)}
        </div >
      </div >
    );
  };

  renderYearHeader = (args?) => {
    return (
      <div className="react-datepicker__header react-datepicker-year-header">
        {getYear(this.state.date)}
      </div>
    );
  };

  renderHeader = headerArgs => {
    switch (true) {
      case this.props.renderCustomHeader !== undefined:
        return this.renderCustomHeader(headerArgs);
      case this.props.showMonthYearPicker || this.props.showQuarterYearPicker:
        return this.renderYearHeader(headerArgs);
      default:
        return this.renderDefaultHeader(headerArgs);
    }
  };

  renderMonths = () => {
    if (this.props.showTimeSelectOnly) {
      return;
    }

    var monthList: any[] = [];
    const monthsShown = this.props.monthsShown || 1;
    var monthsToSubtract = this.props.showPreviousMonths
      ? monthsShown - 1
      : 0;
    var fromMonthDate = subMonths(this.state.date, monthsToSubtract);
    for (var i = 0; i < monthsShown; ++i) {
      var monthsToAdd = i - (this.props.monthSelectedIn || 0);
      var monthDate = addMonths(fromMonthDate, monthsToAdd);
      var monthKey = `month-${i}`;
      monthList.push(
        <div
          key={monthKey}
          ref={div => {
            this.monthContainer = div;
          }}
          className="react-datepicker__month-container"
        >
          {this.renderHeader({ monthDate, i })}
          <Month
            chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
            disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
            weekAriaLabelPrefix={this.props.weekAriaLabelPrefix}
            // onChange={this.changeMonthYear}
            day={monthDate}
            dayClassName={this.props.dayClassName}
            // monthClassName={this.props.monthClassName}
            onDayClick={this.handleDayClick}
            handleOnKeyDown={this.props.handleOnKeyDown}
            onDayMouseEnter={this.handleDayMouseEnter}
            onMouseLeave={this.handleMonthMouseLeave}
            onWeekSelect={this.props.onWeekSelect}
            orderInDisplay={i}
            formatWeekNumber={this.props.formatWeekNumber}
            locale={this.props.locale}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            excludeDates={this.props.excludeDates}
            highlightDates={this.props.highlightDates}
            selectingDate={this.state.selectingDate}
            includeDates={this.props.includeDates}
            inline={this.props.inline}
            fixedHeight={this.props.fixedHeight}
            filterDate={this.props.filterDate}
            preSelection={this.props.preSelection}
            selected={this.props.selected || new Date()}
            selectsStart={this.props.selectsStart}
            selectsEnd={this.props.selectsEnd}
            showWeekNumbers={this.props.showWeekNumbers}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            peekNextMonth={this.props.peekNextMonth}
            setOpen={this.props.setOpen}
            shouldCloseOnSelect={this.props.shouldCloseOnSelect}
            renderDayContents={this.props.renderDayContents}
            disabledKeyboardNavigation={this.props.disabledKeyboardNavigation}
            showMonthYearPicker={this.props.showMonthYearPicker}
            showQuarterYearPicker={this.props.showQuarterYearPicker}
            isInputFocused={this.props.isInputFocused}
            containerRef={this.containerRef}
          />
        </div>
      );
    }
    return monthList;
  };

  renderTimeSection = () => {
    if (
      this.props.showTimeSelect &&
      (this.state.monthContainer || this.props.showTimeSelectOnly)
    ) {
      return (
        <Time
          selected={this.props.selected}
          openToDate={this.props.openToDate}
          onChange={this.props.onTimeChange}
          timeClassName={this.props.timeClassName}
          format={this.props.timeFormat}
          includeTimes={this.props.includeTimes}
          intervals={this.props.timeIntervals}
          minTime={this.props.minTime}
          maxTime={this.props.maxTime}
          excludeTimes={this.props.excludeTimes}
          timeCaption={this.props.timeCaption}
          todayButton={this.props.todayButton}
          // showMonthDropdown={this.props.showMonthDropdown}
          // showMonthYearDropdown={this.props.showMonthYearDropdown}
          // showYearDropdown={this.props.showYearDropdown}
          // withPortal={this.props.withPortal}
          monthRef={this.state.monthContainer}
          injectTimes={this.props.injectTimes}
          locale={this.props.locale}
        />
      );
    }
  };

  renderInputTimeSection = () => {
    const time = this.props.selected ? new Date(this.props.selected) : new Date();
    const timeString = `${addZero(time.getHours())}:${addZero(
      time.getMinutes()
    )}`;
    if (this.props.showTimeInput) {
      return (
        <InputTime
          timeString={timeString}
          timeInputLabel={this.props.timeInputLabel}
          onChange={this.props.onTimeChange}
          customTimeInput={this.props.customTimeInput}
        />
      );
    }
  };

  render() {
    const Container = CalendarContainer;
    return (
      <div ref={this.containerRef}>
        <Container
          className={classnames("react-datepicker", this.props.className, {
            "react-datepicker--time-only": this.props.showTimeSelectOnly
          })}
          showPopperArrow={!!this.props.showPopperArrow}
        >
          {this.renderPreviousButton()}
          {this.renderNextButton()}
          {this.renderMonths()}
          {this.renderTodayButton()}
          {this.renderTimeSection()}
          {this.renderInputTimeSection()}
          {this.props.children}
        </Container>
      </div>
    );
  }
}