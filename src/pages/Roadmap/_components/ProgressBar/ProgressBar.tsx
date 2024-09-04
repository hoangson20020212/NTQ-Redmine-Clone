import { Issue } from "~/types/issue.type";

type ProgressProps = {
  issues: Issue[];
};

const ProgressBar: React.FC<ProgressProps> = ({ issues }) => {
  const closedIssues = issues.filter((issue) => issue.status.name === "Closed").length;
  const newIssues = issues.filter((issue) => issue.status.name === "New").length;
  const totalHours = issues.reduce((acc, issue) => {
    return acc + issue.estimated_hours;
  }, 0);
  const hours = issues.reduce((acc, issue) => {
    return acc + issue.estimated_hours * issue.done_ratio;
  }, 0);
  const percentageClosed = hours / totalHours;
  return (
    <>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 h-6 flex items-center ">
          <div className="bg-green-200 h-6 " style={{ width: `${percentageClosed}%` }} />
        </div>
        <span className=" left-2/4 ml-2 text-xs text-gray-600">{`${percentageClosed.toFixed(0)}%`}</span>
      </div>

      <div className="text-xs mt-2">
        <a href="#" className="text-ocean-blue hover:underline">
          {issues.length} issues
        </a>
        <span>
          {" "}
          ({closedIssues} closed —{" "}
          <a href="" className="text-ocean-blue hover:underline">
            {newIssues} open
          </a>
          )
        </span>
      </div>
    </>
  );
};

export default ProgressBar;
