import React from "react";
import PropTypes from "prop-types";
import {
  getHours,
  getMinutes,
  newDate,
  getStartOfDay,
  addMinutes,
  formatDate,
  isTimeInDisabledRange,
  isTimeDisabled,
  timesToInjectAfter
} from "./date_utils";


interface propTypes {
  format?: string,
  includeTimes?: any[],
  intervals?: number,
  selected?: Date,
  openToDate?: Date,
  onChange?: (time) => any,
  timeClassName?: (time, currH, currM) => any,
  todayButton,
  minTime?: Date,
  maxTime?: Date,
  excludeTimes?: any[],
  monthRef,
  timeCaption?: string,
  injectTimes?: any[],
  locale
};

interface myState {
  height: number | string;
}

export default class Time extends React.Component<propTypes, myState> {
  header;
  list;
  centerLi;

  static get defaultProps() {
    return {
      intervals: 30,
      onTimeChange: () => { },
      todayButton: null,
      timeCaption: "Time"
    };
  }


  static calcCenterPosition = (listHeight, centerLiRef) => {
    return (
      centerLiRef.offsetTop - (listHeight / 2 - centerLiRef.clientHeight / 2)
    );
  };



  state = {
    height: 'auto'
  };

  componentDidMount() {
    // code to ensure selected time will always be in focus within time window when it first appears
    this.list.scrollTop = Time.calcCenterPosition(
      this.props.monthRef
        ? this.props.monthRef.clientHeight - this.header.clientHeight
        : this.list.clientHeight,
      this.centerLi
    );
    if (this.props.monthRef && this.header) {
      this.setState({
        height: this.props.monthRef.clientHeight - this.header.clientHeight
      });
    }
  }

  handleClick = time => {
    if (
      ((this.props.minTime || this.props.maxTime) &&
        isTimeInDisabledRange(time, this.props)) ||
      (this.props.excludeTimes &&
        isTimeDisabled(time, this.props.excludeTimes)) ||
      (this.props.includeTimes &&
        !isTimeDisabled(time, this.props.includeTimes))
    ) {
      return;
    }
    this.props.onChange && this.props.onChange(time);
  };

  liClasses = (time, currH, currM) => {
    let classes = [
      "react-datepicker__time-list-item",
      this.props.timeClassName
        ? this.props.timeClassName(time, currH, currM)
        : undefined
    ];

    if (
      this.props.selected &&
      currH === getHours(time) &&
      currM === getMinutes(time)
    ) {
      classes.push("react-datepicker__time-list-item--selected");
    }
    if (
      ((this.props.minTime || this.props.maxTime) &&
        isTimeInDisabledRange(time, this.props)) ||
      (this.props.excludeTimes &&
        isTimeDisabled(time, this.props.excludeTimes)) ||
      (this.props.includeTimes &&
        !isTimeDisabled(time, this.props.includeTimes))
    ) {
      classes.push("react-datepicker__time-list-item--disabled");
    }
    if (
      this.props.injectTimes &&
      (getHours(time) * 60 + getMinutes(time)) % (this.props.intervals || 0) !== 0
    ) {
      classes.push("react-datepicker__time-list-item--injected");
    }

    return classes.join(" ");
  };

  renderTimes = () => {
    let times: any[] = [];
    const format = this.props.format ? this.props.format : "p";
    const intervals = this.props.intervals || 1;
    const activeTime =
      this.props.selected || this.props.openToDate || newDate();

    const currH = getHours(activeTime);
    const currM = getMinutes(activeTime);
    let base = getStartOfDay(newDate());
    const multiplier = 1440 / intervals;
    const sortedInjectTimes =
      this.props.injectTimes &&
      this.props.injectTimes.sort(function (a, b) {
        return a - b;
      });
    for (let i = 0; i < multiplier; i++) {
      const currentTime = addMinutes(base, i * intervals);
      times.push(currentTime);

      if (sortedInjectTimes) {
        const timesToInject = timesToInjectAfter(
          base,
          currentTime,
          i,
          intervals,
          sortedInjectTimes
        );
        times = times.concat(timesToInject);
      }
    }

    return times.map((time, i) => (
      <li
        key={i}
        onClick={this.handleClick.bind(this, time)}
        className={this.liClasses(time, currH, currM)}
        ref={li => {
          if (currH === getHours(time) && currM >= getMinutes(time)) {
            this.centerLi = li;
          }
        }}
      >
        {formatDate(time, format, this.props.locale)}
      </li>
    ));
  };

  render() {
    const { height } = this.state;

    return (
      <div
        className={`react-datepicker__time-container ${
          this.props.todayButton
            ? "react-datepicker__time-container--with-today-button"
            : ""
          }`}
      >
        <div
          className="react-datepicker__header react-datepicker__header--time"
          ref={header => {
            this.header = header;
          }}
        >
          <div className="react-datepicker-time__header">
            {this.props.timeCaption}
          </div>
        </div>
        <div className="react-datepicker__time">
          <div className="react-datepicker__time-box">
            <ul
              className="react-datepicker__time-list"
              ref={list => {
                this.list = list;
              }}
              style={{ height: height || 'auto' }}
            >
              {this.renderTimes()}
            </ul>
          </div>
        </div>
      </div >
    );
  }
}
