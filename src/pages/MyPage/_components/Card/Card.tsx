import { Issue } from "~/types/issue.type";
import { checkDateStatus } from "~/utils/utils";

interface CardProps {
  issue: Issue;
  day: string;
}

const Card: React.FC<CardProps> = ({ issue, day }) => {
  const urlIcon = checkDateStatus({ startDate: issue.start_date, dueDate: issue.due_date, day });

  return (
    <div className="pop-up z-10 flex absolute top-3 left-6 flex-col gap-y-1 p-1 min-w-[278px] min-h-[152px] border border-black bg-white text-[8.64px] opacity-0 invisible">
      <div className="flex pb-5 items-center">
        <img src={urlIcon} alt="" />
        <a href="#!" className="text-ocean-blue">
          {issue.tracker.name} #{issue.id}
        </a>
        : {issue.subject}
      </div>

      <div className="flex items-center gap-1">
        <span className="font-bold">Project:</span>
        <img src={urlIcon} alt="" />
        <a href="" className="text-ocean-blue">
          {issue.project.name}
        </a>
      </div>

      <div className="flex gap-1">
        <span className="font-bold">Status:</span>
        <span>{issue.status.name}</span>
      </div>

      <div className="flex gap-1">
        <span className="font-bold">Start date:</span>
        <span>{issue.start_date}</span>
      </div>

      <div className="flex gap-1">
        <span className="font-bold">Due date:</span>
        <span>{issue.due_date}</span>
      </div>

      <div className="flex gap-1">
        <span className="font-bold">Assignee:</span>
        <span>{issue?.assigned_to?.name}</span>
      </div>

      <div className="flex gap-1">
        <span className="font-bold">Priority:</span>
        <span>{issue.priority.name}</span>
      </div>
    </div>
  );
};

export default Card;
