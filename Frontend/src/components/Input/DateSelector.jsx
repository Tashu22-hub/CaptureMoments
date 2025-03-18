import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdOutlineDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {
  const [OpenDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div>
      {/* Date Selection Button */}
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date
          ? moment(date).format("Do MMM YYYY")
          : moment().format("Do MMM YYYY")}
      </button>

      {/* Date Picker Modal */}
      {OpenDatePicker && (
        <div className="overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center  absolute top-2 right-2 text-xl text-sky-100 hover:bg-sky-200"
            onClick={() => {setOpenDatePicker(false);

            }}
          >
            <MdClose  className="text-xl text-sky-600"/>
          </button>
          <DayPicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date}
            onSelect={setDate}
            pagedNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
