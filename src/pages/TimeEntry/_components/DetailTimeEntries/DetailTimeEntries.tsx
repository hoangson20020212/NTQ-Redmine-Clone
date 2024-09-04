import React, { useEffect, useState } from "react";
import timeEntriesApi from "~/apis/timeEntries.api";
import moment from "moment";
import issuesApi from "~/apis/issue.api";
import TableTimeEntries from "~/components/Table";

interface ListDataTable {
  id: number;
  project: string | JSX.Element;
  date: string;
  user: string | JSX.Element;
  activity: string;
  comment: string | undefined;
  hours: number;
  issues: string | JSX.Element;
  [key: string]: string | number | JSX.Element | undefined;
}

const COLUMN_NAME_DEFAULT = ["project", "date", "user", "issues", "activity", "comment", "hours", "name"];

interface DetailTimeEntriesProps {
  columnNames: string[];
}

const DetailTimeEntries: React.FC<DetailTimeEntriesProps> = ({ columnNames = COLUMN_NAME_DEFAULT }) => {
  const [listDataTableTime, setListDataTable] = useState<ListDataTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const totalHours = listDataTableTime && listDataTableTime.reduce((acc, current) => acc + current.hours, 0).toFixed(2);

  const fetchTimeEntries = async () => {
    try {
      const responseTime = await timeEntriesApi.listTimeEntries();
      const responseIssues = await issuesApi.listIssues();

      const listDataTable =
        responseTime.data?.time_entries &&
        responseTime.data?.time_entries.map((time) => {
          const issues = responseIssues?.data?.issues.find((issue) => issue?.id === time?.issue?.id);
          const dataIssuesTable = issues ? (
            <span>
              <a href={`/tracker/${issues.id}`} className="text-ocean-blue hover:underline" target="_blank" rel="noopener noreferrer">
                {issues.tracker.name} #{issues.id}
              </a>{" "}
              {issues.subject}
            </span>
          ) : (
            ""
          );
          const project = time.project && (
            <span>
              <a href="" className="text-ocean-blue hover:underline" target="_blank" rel="noopener noreferrer">
                {time.project.name}
              </a>
            </span>
          );
          const userName = time.project && (
            <span>
              <a href="" className="text-ocean-blue hover:underline" target="_blank" rel="noopener noreferrer">
                {time.user.name}
              </a>
            </span>
          );
          return {
            id: time?.id,
            project: project,
            date: moment(time.created_on).format("MM/DD/YYYY"),
            user: userName,
            activity: time.activity.name,
            comment: time.comments,
            hours: time.hours,
            issues: dataIssuesTable,
          };
        });
      setListDataTable(listDataTable);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className=" font-bold text-mouse-gray">Total time: {totalHours ? totalHours : 0} hours</p>
      <TableTimeEntries columnNames={columnNames} dataTable={listDataTableTime} loading={isLoading} isCheckbox={true} />
      <p className="text-10 text-ocean-blue">
        (1-{listDataTableTime.length}/{listDataTableTime.length})
      </p>
    </div>
  );
};

export default DetailTimeEntries;
