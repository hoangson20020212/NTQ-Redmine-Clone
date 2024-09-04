import React from "react";
import { Link } from "react-router-dom";
import issuesApi from "~/apis/issue.api";
import TableIssues from "~/components/Table";
import CloseImg from "~/assets/images/close-img.png";
import { optionBlockMyPage } from "~/constants/constants";
import { useGlobalStore } from "~/store/globalStore";
import { IssueTable } from "~/types/issue.type";
import { removeBlockFromBoardSections } from "~/utils/utils";
import { useQuery } from "@tanstack/react-query";
import config from "~/constants/config";
import moment from "moment";

const COLUMN_NAME = ["#", "project", "tracker", "subject"];

const fetchIssuesWatcher = async (): Promise<IssueTable[]> => {
  const response = await issuesApi.listIssues({ watcher_id: "me" });
  return response.data?.issues?.map((issue) => ({
    idProject: issue.project.id,
    "#": issue.id,
    project: issue.project.name,
    tracker: issue.tracker.name,
    status: issue.status.name,
    priority: issue.priority.name,
    assignee: issue?.assigned_to?.name,
    subject: issue.subject,
    updated: moment(issue.updated_on).format("MM/DD/YYYY hh:mm A"),
    author: issue.author.name,
    targetVersion: issue?.fixed_version?.name,
    startDate: moment(issue.start_date).format("MM/DD/YYYY"),
    dueDate: moment(issue.due_date).format("MM/DD/YYYY"),
    estimatedTime: issue.estimated_hours,
    doneRatio: issue.done_ratio,
    created_on: moment(issue.created_on).format("MM/DD/YYYY hh:mm A"),
  }));
};

const WatchedIssues: React.FC = () => {
  const { isEditMyPage, removeBlock } = useGlobalStore((state) => ({
    isEditMyPage: state.isEditMyPage,
    removeBlock: state.removeBlock,
  }));

  const { data: listIssuesWatcher = [], isLoading } = useQuery({
    queryKey: ["listIssuesWatcher"],
    queryFn: fetchIssuesWatcher,
    staleTime: config.staleTime,
  });

  const handleClose = () => {
    const blockId = optionBlockMyPage.find((block) => block.title === "Watched issues")?.id || "";
    removeBlockFromBoardSections({
      blockId: blockId,
    });
    removeBlock(blockId);
  };

  return (
    <div>
      <div className="flex justify-between items-center ">
        <Link className="text-ocean-blue font-semibold hover:underline" to="/issues">
          Watched issues ({listIssuesWatcher.length})
        </Link>
        {isEditMyPage && (
          <img
            className="w-fit h-fit mr-3 cursor-pointer"
            data-testid="btn-close-watched-issues"
            onClick={handleClose}
            src={CloseImg}
            alt="closeButton"
          />
        )}
      </div>
      <TableIssues className="bg-slate-500 min-w-full mt-3" loading={isLoading} columnNames={COLUMN_NAME} dataTable={listIssuesWatcher} />
    </div>
  );
};

export default WatchedIssues;
