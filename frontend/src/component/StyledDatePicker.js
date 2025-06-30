import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import { FaCalendarAlt } from 'react-icons/fa';

const StyledDatePicker = ({ selectedDate, onChange, label }) => (
  <div className="date-picker-container">
    <label className="date-picker-label">{label}</label>
    <div className="date-picker-wrapper">
      <FaCalendarAlt className="calendar-icon" />
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        maxDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className="styled-date-picker"
      />
    </div>
  </div>
);

export default StyledDatePicker;
