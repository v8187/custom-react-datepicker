import PropTypes from "prop-types";
import React from "react";

interface propTypes {
  className?: string,
  children,
  arrowProps?,
  showPopperArrow: boolean
};

export default function CalendarContainer({
  className,
  children,
  showPopperArrow,
  arrowProps = {}
}: propTypes) {
  return (
    <div className={className || ''}>
      {showPopperArrow && (
        <div className="react-datepicker__triangle" {...arrowProps} />
      )}
      {children}
    </div>
  );
}


