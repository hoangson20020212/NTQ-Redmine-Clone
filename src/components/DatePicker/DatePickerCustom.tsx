import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "~/assets/images/calendar.png";
import { cn } from "~/utils/utils";
import "./DatePicker.css";

type DatePickerCustomProps = {
  classNameDatePicker?: string;
  className?: string;
  name?: string;
  id?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
};

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({ classNameDatePicker, id, className, name, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCalendar = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        weekLabel="Wk"
        showWeekNumbers
        className={cn("border pl-1 w-24 text-xs py-0.5", classNameDatePicker)}
        open={isOpen}
        name={name}
        onClickOutside={() => setIsOpen(false)}
      >
        <div>
          <hr className="w-64 border-t-2" />
          <div className="flex justify-between pt-2">
            <button className="border border-gray-300 text-blue-gray rounded-md bg-slate-50 px-2 py-1 hover:border-blue-gray">Today</button>
            <button
              className="border border-gray-300 text-blue-gray font-bold rounded-md bg-slate-50 px-2 py-1 relative left-10 hover:border-blue-gray"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </DatePicker>
      <img src={Calendar} alt="Calendar" className="cursor-pointer ml-1" onClick={toggleCalendar} />
    </div>
  );
};

export default DatePickerCustom;
