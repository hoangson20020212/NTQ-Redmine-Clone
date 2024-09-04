import { useEffect, useState } from "react";
import Filter from "../MyPage/_components/Filter";
import { Link, useParams } from "react-router-dom";
import ApplyImg from "~/assets/images/apply-img.png";
import WifiImg from "~/assets/images/wifi-img.png";
import IconSuccess from "~/assets/images/apply-img.png";
import ReLoadImg from "~/assets/images/reload-img.png";
import { Helmet } from "react-helmet-async";
import TableIssues from "~/components/Table";
import OptionIssues from "~/components/OptionIssues";
import issuesApi from "~/apis/issue.api";
import { useQuery } from "@tanstack/react-query";
import config from "~/constants/config";
import moment from "moment";
import { useGlobalStore } from "~/store/globalStore";

const COLUMN_NAME_DEFAULT = ["#", "project", "tracker", "status", "priority", "assignee", "updated", "author"];

const Issues = () => {
  const { name, id } = useParams();
  const [columnName, setColumnName] = useState<string[]>(["#", "project", "tracker", "status", "priority", "assignee", "updated", "author"]);
  const [midColumnName, setMidColumnName] = useState<string[]>(["#", "project", "tracker", "status", "priority", "assignee", "updated", "author"]);
  const isProjectPage = location.pathname.startsWith(`/projects`);
  const projectID = Number(id) ? Number(id) : 323;

  const { isSuccessEdit, setIsSuccessEdit } = useGlobalStore((state) => ({
    isSuccessEdit: state.isSuccessEdit,
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

  const fetchIssuesOfProject = async () => {
    const response = await issuesApi.listIssues({ project_id: projectID });
    return (
      response.data?.issues?.map((issue) => {
        const doneRatio = (
          <div className="bg-black-200 h-4">
            <div className="bg-green-400 h-4" style={{ width: `${issue.done_ratio}%` }}></div>
          </div>
        );
        return {
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
          doneRatio: doneRatio,
          created_on: moment(issue.created_on).format("MM/DD/YYYY hh:mm A"),
        };
      }) || []
    );
  };

  const {
    data: listIssuesOfProject = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["issuesProjects"],
    queryFn: () => fetchIssuesOfProject(),
    staleTime: config.staleTime,
  });

  const handleApply = () => {
    setColumnName(midColumnName);
  };

  const onChangeOptions = (optionArray: string[]) => {
    setMidColumnName(optionArray);
  };

  useEffect(() => {
    if (isSuccessEdit) {
      refetch();
      const timer = setTimeout(() => {
        setIsSuccessEdit(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessEdit]);

  return (
    <>
      <Helmet>
        <title>{`Issues - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="flex">
        <div className="flex flex-col gap-3 min-h-84 pt-2 bg-white w-9/12 px-3 mt-3 pb-8 border border-solid border-gray-300">
          {isSuccessEdit && (
            <div className="flex mt-3 items-center text-xs text-lime-900 p-2 bg-green-100 border-2 border-lime-500">
              <img className="flex w-fit h-fit" src={IconSuccess} alt="Error" />
              <div className="pl-5">Successful creation.</div>
            </div>
          )}
          <h2 className="text-base text-mouse-gray font-bold">Issues</h2>
          <Filter />
          <OptionIssues onChangeOptions={onChangeOptions} />
          <div className="flex text-xs gap-2 ">
            <button className="flex gap-1 hover:underline" onClick={handleApply}>
              <img src={ApplyImg} alt="apply" /> Apply
            </button>
            <button className="flex gap-1 hover:underline" onClick={() => setColumnName(COLUMN_NAME_DEFAULT)}>
              <img src={ReLoadImg} alt="apply" /> Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            <TableIssues className="w-full" columnNames={columnName} dataTable={listIssuesOfProject} isCheckbox={true} loading={isLoading} />
          </div>
          <p className="text-10 text-ocean-blue">
            (1-{listIssuesOfProject.length}/{listIssuesOfProject.length})
          </p>
          <div>
            <p className="text-xs flex gap-1 justify-end mt-1.5">
              Also available in: <img src={WifiImg} alt="img" />{" "}
              <a className="text-ocean-blue" href="">
                Atom
              </a>
            </p>
          </div>
        </div>
        <div className=" flex flex-col gap-3 p-6 text-xs">
          <>
            <h2 className="text-base text-mouse-gray font-bold">Issues</h2>
            <div className="text-ocean-blue flex flex-col gap-2">
              <Link to={`/projects/${id}/${name}/issues`}>View all issues</Link>
              {isProjectPage && <Link to="">Summary</Link>}
              <Link to={`/projects/${id}/${name}/issues/calendar`}>Calendar</Link>
              <Link to="">Gantt</Link>
              {!isProjectPage && <Link to="">Agile board</Link>}
            </div>
          </>
          {!isProjectPage && (
            <div>
              <h2 className="text-base text-mouse-gray font-bold mb-2">Agile charts</h2>
              <Link className="text-ocean-blue" to="">
                Issues burndown
              </Link>
            </div>
          )}
          <div>
            <h2 className="text-base text-mouse-gray font-bold mb-2">Custom queries</h2>
            <Link className="text-ocean-blue" to="">
              Ticket open by subProject
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Issues;
