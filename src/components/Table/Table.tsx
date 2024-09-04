import React, { useState, useRef, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import Dialog from "~/pages/MyPage/_components/Dialog";
import ApplyImg from "~/assets/images/apply-img.png";
import { useGlobalStore } from "~/store/globalStore";
import ContextMenu from "~/components/ContextMenu";

interface PropsComponent {
  className?: string;
  columnNames: string[];
  loading?: boolean;
  dataTable?: { [key: string]: string | number | JSX.Element | undefined }[];
  isCheckbox?: boolean;
}

const Table: React.FC<PropsComponent> = ({ className, columnNames = [], dataTable = [], loading = true, isCheckbox = false }) => {
  const { activeItemId, setActiveItemId } = useGlobalStore((state) => state);
  const [checkList, setCheckList] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [idCurrentLocation, setIdCurrentLocation] = useState<number>(1);

  const handleMouseDown = (index: number) => {
    setActiveItemId(index);
  };

  const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckList((prev) => [...prev, index]);
    } else {
      setCheckList((prev) => prev.filter((item) => item !== index));
    }
  };

  const handleChecked = (index: number) => {
    if (checkList.includes(index)) {
      setCheckList((prev) => prev.filter((item) => item !== index));
    } else {
      setCheckList((prev) => [...prev, index]);
    }
  };

  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckList([]);
    } else {
      const allIndexes = dataTable.map((_, index) => index);
      setCheckList(allIndexes);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClickedPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
      setClickedPosition(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <table className={`table-auto text-xs text-mouse-gray ${className}`}>
        <thead className="bg-gray-200   ">
          <tr className="h-7">
            {isCheckbox && (
              <>
                <th
                  className="text-center capitalize  border border-solid border-gray-300 border-b-slate-600 text-gray-600 px-5 tracking-wider cursor-pointer"
                  onClick={handleCheckAll}
                >
                  <img src={ApplyImg} alt="Checkbox" />
                </th>
              </>
            )}
            {columnNames.map((columnName, index) => (
              <th
                className={`text-center capitalize border border-solid border-gray-300 border-b-slate-600 text-gray-600 px-5 tracking-wider w-auto ${index === 1 || index === 3 ? "w-auto " : "w-auto"}`}
                key={columnName}
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading && (
            <tr className="h-7">
              <td className="text-center w-full" colSpan={isCheckbox ? columnNames.length + 1 : columnNames.length}>
                <div className="flex justify-center">
                  <BeatLoader color="#169" size={5} />
                </div>
              </td>
            </tr>
          )}
          {dataTable.map((row, rowIndex) => (
            <tr
              key={rowIndex + 1}
              onClick={() => handleChecked(rowIndex)}
              className={`cursor-pointer ${rowIndex % 2 === 0 ? "bg-gray-100 hover:bg-yellow-100 h-7" : "hover:bg-yellow-100 h-7"}`}
            >
              {isCheckbox && (
                <td className="text-center">
                  <input type="checkbox" checked={checkList.includes(rowIndex)} onChange={handleCheckboxChange(rowIndex)} />
                </td>
              )}
              {columnNames.map((columnName) => {
                const id = row["#"];
                const columnTable = columnName.replace(/\s+/g, "");
                const priority = row?.priority;
                return (
                  <td
                    key={columnName}
                    onContextMenu={(e) => {
                      setIdCurrentLocation(id as number);
                      handleRightClick(e);
                    }}
                    className={`${columnName === "tracker" ? "text-center whitespace-nowrap px-3" : "hover:underline text-center whitespace-nowrap px-3"} ${priority === "Low" && "bg-blue-50"} ${priority === "High" && "bg-red-100"} ${priority === "Urgent" && "bg-red-200"} ${priority === "Immediate" && "bg-red-200 text-red-900 font-semibold"}`}
                  >
                    {row[columnTable] !== undefined &&
                      (typeof id === "number" ? (
                        <Dialog
                          issueId={id}
                          content={row[columnTable] as string}
                          handleClick={handleMouseDown}
                          ZIndex={activeItemId === id ? 40 : 30}
                        />
                      ) : (
                        row[columnTable]
                      ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {clickedPosition && (
        <div
          ref={itemRef}
          className="fixed transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: clickedPosition.y, left: clickedPosition.x - 160 }}
        >
          <ContextMenu id={idCurrentLocation} setClickedPosition={setClickedPosition} />
        </div>
      )}
    </>
  );
};

export default Table;
