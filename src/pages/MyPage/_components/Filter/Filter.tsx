import { useState } from "react";
import ArrowCollapsed from "~/assets/images/arrow_collapsed.png";
import ArrowExpanded from "~/assets/images/arrow_expanded.png";
import TogglePlus from "~/assets/images/bullet_toggle_plus.png";
import DatePickerCustom from "~/components/DatePicker";
import Input from "~/components/Input";
import Select from "~/components/Select";

interface FilterItem {
  title: string;
  sortBy?: { value: string; label: string }[];
  type: "select" | "date" | "input";
  filerOptions?: { value: string; label: string }[];
}

const Filter = () => {
  const fakeData: FilterItem[] = [
    {
      title: "Status",
      sortBy: [
        { value: "is not", label: "is not" },
        { value: "is", label: "is" },
      ],
      type: "select",
      filerOptions: [
        { value: "Contain", label: "Contain" },
        { value: "Done", label: "Done" },
        { value: "Doing", label: "Doing" },
        { value: "Reopen", label: "Reopen" },
        { value: "Close", label: "Close" },
        { value: "Open", label: "Open" },
      ],
    },
    {
      title: "Start date",

      type: "date",
    },
    {
      title: "Copied to",
      type: "input",
    },
  ];

  const [isDragDown, setIsDragDown] = useState(true);
  const [size, setSize] = useState<number>(0);

  const handleAddSize = () => {
    setSize((prevSize) => (prevSize === 0 ? 5 : 0));
  };

  const handleClickDragDown = () => {
    setIsDragDown((prevIsDragDown) => !prevIsDragDown);
  };

  return (
    <>
      <div className="relative pb-2 my-2">
        <hr />
        <div className="flex items-center px-1 absolute -top-2 left-3 bg-white cursor-pointer" onClick={handleClickDragDown}>
          <div className="text-gray-700">
            <img src={isDragDown ? ArrowExpanded : ArrowCollapsed} alt="icon expend" />
          </div>
          <span className="text-10 text-gray-rain">Filters</span>
        </div>
      </div>
      {isDragDown && (
        <div className="flex justify-between px-3">
          <div className="gap-2 min-w-16 w-3/4">
            {fakeData.map((item) => (
              <div key={item.title} className="flex items-center">
                <div className="flex items-center gap-2 w-72">
                  <input type="checkbox" className="" />
                  <label htmlFor="assignee-role" className="text-10">
                    {item.title}
                  </label>
                </div>
                <div className="w-80">
                  {item.type === "select" && (
                    <Select className="bg-[#efefef] border text-xs">
                      {item.sortBy?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
                <div className="flex items-center">
                  {item.type === "input" && <Input type="text" className="border" />}
                  {item.type === "select" && (
                    <>
                      <Select className="bg-transparent border h-full bg-[#efefef] pl-0 text-xs" size={size}>
                        {item.filerOptions?.map((filterOption) => (
                          <option key={filterOption.value} value={filterOption.value}>
                            {filterOption.label}
                          </option>
                        ))}
                      </Select>
                      <img src={TogglePlus} alt="Toggle Plus" className="cursor-pointer" onClick={handleAddSize} />
                    </>
                  )}
                  {item.type === "date" && <DatePickerCustom className="pl-1" />}
                </div>
              </div>
            ))}
          </div>
          <div>
            <span className="text-10 text-gray-rain">Add filter </span>
            <Select className="border text-xs">
              <option value="Developer">Developer</option>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
