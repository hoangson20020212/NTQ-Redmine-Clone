import moment from "moment";
import React from "react";
import { BeatLoader } from "react-spinners";
import DeleteImg from "~/assets/images/delete-img.png";
import EditImg from "~/assets/images/edit-img.png";
import { TimeEntriesTable } from "~/types/timeEntries.type";
import { groupTimeEntriesByDate } from "~/utils/utils";

interface PropsComponent {
  className?: string;
  columnNames: string[];
  loading?: boolean;
  dataTable?: TimeEntriesTable[];
}

const TableSpentTime: React.FC<PropsComponent> = ({ className, columnNames = [], dataTable = [], loading = true }) => {
  const today = moment().format("MM/DD/YYYY");
  const groupedEntries = groupTimeEntriesByDate(dataTable);
  const styleTd = "text-center text-xs whitespace-nowrap";

  return (
    <table className={`table-auto text-mouse-gray ${className}`}>
      <thead className="bg-gray-200   ">
        <tr className="h-7">
          {columnNames.map((columnName, index) => (
            <th
              className={`text-center text-xs border border-solid border-gray-300 border-b-slate-600 text-gray-600 px-5 tracking-wider w-auto ${index === 1 || index === 3 ? "w-auto " : "w-auto"}`}
              key={columnName}
            >
              {columnName === "Action" ? "" : columnName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading && (
          <tr className="h-7">
            <td className="text-center w-full" colSpan={columnNames.length}>
              <div className="flex justify-center">
                <BeatLoader color="#169" size={5} />
              </div>
            </td>
          </tr>
        )}
        {groupedEntries.map((group) => (
          <React.Fragment key={group.date}>
            <tr className="hover:bg-yellow-100 bg-gray-100 h-7">
              <td className={`${styleTd} font-bold`}>{group.date === today ? "Today" : group.date}</td>
              <td colSpan={2}></td>
              <td className={styleTd}>{group.totalHours.toFixed(2)}</td>
              <td></td>
            </tr>
            {group.entries.map((entry) => {
              return (
                <tr key={entry.id} className="hover:bg-yellow-100 h-7">
                  <td className={styleTd}>{entry.activity}</td>
                  <td className={styleTd}>{entry.project}</td>
                  <td className={styleTd}>{entry.comment}</td>
                  <td className={styleTd}>{entry.hours.toFixed(2)}</td>
                  <td className={styleTd}>
                    <div className="flex text-center text-sm justify-center">
                      <img alt="edit" className="mr-1 cursor-pointer" src={EditImg} onClick={() => alert("Edit")} />
                      <img alt="delete" className="mr-1 cursor-pointer" src={DeleteImg} onClick={() => alert("Delete")} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableSpentTime;
