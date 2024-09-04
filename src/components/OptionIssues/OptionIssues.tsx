import React, { useState } from "react";
import ArrowCollapsed from "~/assets/images/arrow_collapsed.png";
import ArrowExpanded from "~/assets/images/arrow_expanded.png";
import { Button } from "~/components/Button/Button";

import Select from "../Select";
interface OptionProps {
  onChangeOptions: (optionArray: string[]) => void;
}

const OptionIssues: React.FC<OptionProps> = ({ onChangeOptions }) => {
  const [isDragDown, setIsDragDown] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([
    "parent Task",
    "category",
    "target Version",
    "start Date",
    "due Date",
    "estimated Time",
    "spent time",
    "total spent time",
    "done Ratio",
    "created_on",
    "closed_on",
    "related issues",
    "target",
    "degrade",
    "similar",
    "cause",
    "solution",
    "process",
    "from customer",
    "version",
    "functionID",
    "bug type",
    "severity",
    "testCaseID",
    "purpose",
    "department",
    "duplicate issue",
    "tested OK",
    "qna related",
    "difficulty",
    "test on staging OK",
    "defect origin",
    "qc activity",
    "defect type",
    "cause category",
    "main pic",
    "reviewer",
    "defect author",
    "release date",
    "merge to cr",
    "customer",
    "expected revenue ($)",
    "% success",
    "sale",
    "why not find out?",
    "next due date",
    "next action",
    "builded",
    "current state",
    "test checklist",
    "reproduce",
    "after refactor",
    "swat",
    "test environment",
    "late release",
    "release note",
    "dev_ self tested ok?",
    "contract type",
    "project line",
    "business domain",
    "technology",
    "project size (mm)",
    "team size (mm)",
    "is degrade?",
    "cause (lost/closed/pending)",
    "new customer?",
    "reopen count",
    "new customer info",
    "customer type",
    "pic os",
    "đánh giá của am",
    "đánh giá của os",
    "market",
    "certainty",
    "opp's type",
    "service offering",
    "release ok",
  ]);
  const [middleArray, setMiddleArray] = useState<string[]>([]);
  const [currentColumn, setCurrentColumn] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState(["#", "project", "tracker", "status", "priority", "assignee", "updated", "author"]);

  const handleClickDragDown = () => {
    setIsDragDown((isDragDown) => !isDragDown);
  };

  const handleCurrentColumn = (name: string) => {
    setCurrentColumn(name);
  };

  const handleClickItem = (nameRow: string) => {
    if (currentColumn === "available") {
      const row = availableColumns.find((option) => {
        return option === nameRow;
      });
      if (row) {
        const newAvailable = availableColumns.filter((item) => item !== nameRow);
        const newSelect = [...selectedColumns, row];
        setAvailableColumns(newAvailable);
        setSelectedColumns(newSelect);
        onChangeOptions(newSelect);
      }
    } else if (currentColumn === "selected") {
      const row = selectedColumns.find((option) => {
        return option === nameRow;
      });
      if (row) {
        const newSelect = selectedColumns.filter((item) => item !== nameRow);
        const newAvailable = [...availableColumns, row];
        setAvailableColumns(newAvailable);
        setSelectedColumns(newSelect);
        onChangeOptions(newSelect);
      }
    }
  };

  const handleMultiSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setMiddleArray(selectedValues);
  };

  const moveLeft = () => {
    if (middleArray.length > 0 && currentColumn === "available") {
      const newSelectedColumns = [...selectedColumns, ...middleArray];
      const newAvailableColumns = availableColumns.filter((item) => !middleArray.includes(item));
      setAvailableColumns(newAvailableColumns);
      setSelectedColumns(newSelectedColumns);
      onChangeOptions(newSelectedColumns);
      setMiddleArray([]);
    }
  };

  const moveRight = () => {
    if (middleArray.length > 0 && currentColumn === "selected") {
      const newAvailableColumns = [...availableColumns, ...middleArray];
      const newSelectedColumns = selectedColumns.filter((item) => !middleArray.includes(item));
      setAvailableColumns(newAvailableColumns);
      setSelectedColumns(newSelectedColumns);
      onChangeOptions(newSelectedColumns);
      setMiddleArray([]);
    }
  };

  const moveUp = () => {
    if (currentColumn === "selected") {
      const copySelectedColumns = selectedColumns;
      middleArray.map((item) => {
        const index = copySelectedColumns.indexOf(item);
        if (index !== 0) {
          const move = copySelectedColumns.splice(index, 1)[0];
          copySelectedColumns.splice(index - 1, 0, move);
          setSelectedColumns(copySelectedColumns);
          onChangeOptions(copySelectedColumns);
        }
      });
      setMiddleArray([]);
    }
  };

  const moveDown = () => {
    if (currentColumn === "selected") {
      const copySelectedColumns = selectedColumns;
      middleArray.map((item) => {
        const index = copySelectedColumns.indexOf(item);
        if (index !== selectedColumns.length - 1) {
          const move = copySelectedColumns.splice(index, 1)[0];
          copySelectedColumns.splice(index + 1, 0, move);
          setSelectedColumns(copySelectedColumns);
          onChangeOptions(copySelectedColumns);
        }
      });
      setMiddleArray([]);
    }
  };

  const moveTop = () => {
    if (currentColumn === "selected") {
      const copySelectedColumns = selectedColumns;
      middleArray.reverse();

      middleArray.map((item) => {
        const index = copySelectedColumns.indexOf(item);
        if (index !== 0) {
          const move = copySelectedColumns.splice(index, 1)[0];
          copySelectedColumns.unshift(move);
          setSelectedColumns(copySelectedColumns);
          onChangeOptions(copySelectedColumns);
        }
      });
      setMiddleArray([]);
    }
  };

  const moveBottom = () => {
    if (currentColumn === "selected") {
      const copySelectedColumns = selectedColumns;
      middleArray.map((item) => {
        const index = copySelectedColumns.indexOf(item);
        if (index !== selectedColumns.length - 1) {
          const move = copySelectedColumns.splice(index, 1)[0];
          copySelectedColumns.push(move);
          setSelectedColumns(copySelectedColumns);
          onChangeOptions(copySelectedColumns);
        }
      });
      setMiddleArray([]);
    }
  };

  return (
    <>
      <div className="relative pb-3">
        <hr />
        <div className="flex items-center px-1 absolute -top-2 left-3 bg-white cursor-pointer" onClick={handleClickDragDown}>
          <div className="text-gray-700">
            <img src={isDragDown ? ArrowExpanded : ArrowCollapsed} alt="icon expend" />
          </div>

          <span className="text-10 text-gray-rain">Options</span>
        </div>
      </div>

      {isDragDown && (
        <div className="flex items-center mt-1 ml-4 pb-2">
          <span className="text-gray-rain text-10 mr-1">Columns</span>
          <div className="flex flex-col">
            <div className="text-gray-rain text-10 inline-block">Available Columns</div>
            <Select size={10} className="h-full w-40 text-xs m-0" defaultValue={[]} multiple={true} onChange={(e) => handleMultiSelect(e)}>
              {availableColumns.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="h-[18px] pb-px pl-0.5 capitalize"
                  onDoubleClick={() => handleClickItem(option)}
                  onClick={() => handleCurrentColumn("available")}
                >
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-0.5">
            <Button className="w-8" onClick={moveLeft}>
              →
            </Button>
            <Button className="w-8" onClick={moveRight}>
              ←
            </Button>
          </div>
          <div className="flex flex-col ml-1">
            <div className="text-gray-rain text-10 inline-block">Selected Columns</div>
            <Select
              size={10}
              className="h-full w-40 text-xs m-0"
              multiple={true}
              defaultValue={[]}
              onFocus={(e) => handleMultiSelect(e)}
              onChange={(e) => handleMultiSelect(e)}
            >
              {selectedColumns.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="h-[18px] pb-px pl-0.5 capitalize"
                  onDoubleClick={() => handleClickItem(option)}
                  onClick={() => handleCurrentColumn("selected")}
                >
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-0.5">
            <Button className="w-8" onClick={moveTop}>
              ⇈
            </Button>
            <Button className="w-8" onClick={moveUp}>
              ↑
            </Button>
            <Button className="w-8" onClick={moveDown}>
              ↓
            </Button>
            <Button className="w-8" onClick={moveBottom}>
              ⇊
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default OptionIssues;
