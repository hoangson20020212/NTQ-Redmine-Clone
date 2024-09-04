import React, { useState } from "react";
import "~/pages/MyPage/_components/Dialog/Dialog.css";
import Label from "~/components/Label";
import IconSearch from "~/assets/images/magnifier.png";
import Button from "~/components/Button";

interface Member {
  id: number;
  name: string;
  role: string;
}

interface DialogProps {
  data: Member[];
  handleClick: (isVisible: boolean) => void;
}

const ModalAddWatchers: React.FC<DialogProps> = ({ data, handleClick }) => {
  const [isActiveParentTask, setIsActiveParentTask] = useState(false);

  const handleClickOutside = () => {
    handleClick(false);
  };

  return (
    <>
      <div className="w-screen h-screen top-0 bg-[#b5b5b5] background_opacity opacity-40 fixed z-50"></div>
      <div className="w-[410px]  border  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#fff] z-50">
        <div className="border py-1.5 px-2 flex justify-between rounded-md title_dialog items-center">
          <span className="font-bold text-[#fff] text-[13.2px] overflow-hidden whitespace-nowrap text-ellipsis">Add watchers</span>
          <button
            className="w-5 h-5 icon_close bg-[#f6f6f6] px-2 rounded-sm border-[1px] border-[#ccc] hover:border-[#628db6]"
            onClick={handleClickOutside}
            title="Close"
          ></button>
        </div>

        <form action="">
          <div className="flex flex-col items-center">
            <div className="">
              <Label htmlFor="ParentTask" className="flex gap-1 items-center p-0 parent-task" name="Search for user:"></Label>
              <div className={`flex items-center border ml-1 w-52 ${isActiveParentTask ? "border-[black] rounded-sm" : ""}`}>
                <img src={IconSearch} alt="IconSearch" className="px-1" />
                <input
                  id="ParentTask"
                  type="text"
                  className="outline-none w-full text-xs py-1"
                  onFocus={() => setIsActiveParentTask(true)}
                  onBlur={() => setIsActiveParentTask(false)}
                />
              </div>
            </div>
            <div className="">
              <div className="text-xs text-[#505050] pl-3 h-full pt-3">
                {data.map((item) => {
                  return (
                    <div className="flex items-center gap-1 min-w-72 pr-4" key={item.id}>
                      <input type="checkbox" />
                      <span className="">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pt-3 pr-3 pb-2">
            <Button type="button">Add</Button>
            <Button type="button" onClick={handleClickOutside}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalAddWatchers;
