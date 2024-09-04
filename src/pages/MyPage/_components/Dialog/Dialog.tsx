import React, { useState } from "react";
import issuesApi from "~/apis/issue.api";
import { Issue } from "~/types/issue.type";
import { useGlobalStore } from "~/store/globalStore";
import Select from "~/components/Select";
import IconSearch from "~/assets/images/magnifier.png";
import Button from "~/components/Button";
import { Rnd } from "react-rnd";
import "./Dialog.css";
import Loading from "~/components/Loading";
import { convertDateFormat, getSecondsDifference } from "~/utils/utils";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  issueId: number;
  content?: string | JSX.Element;
  ZIndex?: number;
  handleClick: (index: number) => void;
}

const RELATED_ISSUE_OPTIONS = [
  { label: "Related to", value: "relates" },
  { label: "Duplicates", value: "duplicates" },
  { label: "Duplicated by", value: "duplicated" },
  { label: "Blocks", value: "blocks" },
  { label: "Precedes", value: "precedes" },
  { label: "Follows", value: "follows" },
  { label: "Copied to", value: "copied_to" },
  { label: "Copied from", value: "copied_from" },
];

const Dialog: React.FC<DialogProps> = ({ issueId, content = "", ZIndex, handleClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { activeItemId, setActiveItemId } = useGlobalStore((state) => state);
  const [issue, setIssue] = useState<Issue | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [displayRelatedIssue, setDisplayRelatedIssue] = useState<boolean>(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleClickOutside = () => {
    setIsVisible(false);
    setActiveItemId(0);
  };

  const fetchIssue = async () => {
    try {
      if (activeItemId !== issueId) {
        setLoading(true);
        const response = await issuesApi.getIssueById({ id: issueId });
        console.log(response.data.issue);
        setIssue(response.data.issue);
        setIsVisible(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateDetail = () => {
    navigate(`/projects/${issue?.project.id}/${issue?.project.name}/issues/${issue?.id}`, {
      state: { issueId: issue?.id, tracker: issue?.tracker.name },
    });
  };

  const handleNavigateEdit = () => {
    navigate(`/projects/${issue?.project.id}/${issue?.project.name}/issues/${issue?.id}/edit`, {
      state: { issue: issue?.id, tracker: issue?.tracker.name },
    });
  };

  console.log(issue);
  return (
    <>
      <div
        onClick={() => {
          fetchIssue();
        }}
      >
        {content}
      </div>
      {loading && <Loading />}
      <div className={`wrapper ${isVisible ? "" : "disappear"}`} style={{ zIndex: ZIndex }}>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 645,
            height: 615,
          }}
          minWidth={200}
          minHeight={150}
          style={{ zIndex: ZIndex }}
          dragHandleClassName="drag-handle"
          onDragStart={() => {
            handleClick(issueId);
          }}
          className="bg-zinc-100 rounded p-1 border border-zinc-200 h-full overflow-hidden"
        >
          <div className="drag-handle border py-1.5 px-2 flex justify-between rounded-md title_dialog items-center cursor-move">
            <span className="font-bold text-white text-sm overflow-hidden whitespace-nowrap text-ellipsis">
              Quick View - #{issue?.id} {issue?.subject}
            </span>
            <button
              className="size-5 icon_close bg-white px-2 rounded-sm border border-gray-300 hover:border-blue-gray "
              onClick={handleClickOutside}
              title="Close"
            ></button>
          </div>
          <div style={{ flexGrow: 1, overflow: "auto", height: "calc(100% - 110px)" }} className="bg-white h-4/5 overflow-auto mb-2">
            <div className="mx-3 mt-2 border p-2 text-zinc-700 text-sm bg-yellow-50">
              <div className="flex gap-2 flex-wrap">
                <div className="size-16 p-1 border bg-white">
                  <img
                    src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-base font-bold text-mouse-gray whitespace-normal">{issue?.subject}</h3>
                  <div className="text-sm font-light whitespace-normal">
                    {"Added by "}
                    <a href="" className="link">
                      {issue?.author.name}
                    </a>
                    <a href="" className="link">
                      {`${getSecondsDifference(issue?.created_on)} `}
                    </a>
                    ago.
                  </div>
                </div>
              </div>
              <div className="text-left pb-1">
                <div className="flex flex-wrap">
                  <div className="pt-1 text-xs flex items-center w-1/2 min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold w-2/5 min-w-14">
                      Status:
                    </label>
                    <span className="w-1/2 min-w-14">{issue?.status.name}</span>
                  </div>
                  <div className="pt-1 text-xs w-1/2 flex items-center min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold w-2/5 min-w-14">
                      Start date:
                    </label>
                    {issue && issue.start_date && <span className="w-1/2 min-w-14">{convertDateFormat(issue.start_date)}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div className="pt-1 text-xs flex items-center w-1/2 min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-14">
                      Priority:
                    </label>
                    <span className="w-1/2 min-w-14">{issue?.priority.name}</span>
                  </div>
                  <div className="pt-1 text-xs w-1/2 flex items-center min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-14">
                      Due date:
                    </label>
                    {issue && issue.due_date && <span className="w-1/2 min-w-14">{convertDateFormat(issue.due_date)}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div className="flex w-1/2 text-xs mt-1 min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-14">
                      Assignee:
                    </label>
                    <span className="flex w-1/2">
                      <div className="size-5 p-0.5 border mr-1">
                        <img
                          src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                          alt="Avatar"
                          className="object-cover"
                        />
                      </div>
                      <a href="#!" className="link whitespace-normal">
                        {issue?.assigned_to ? issue?.assigned_to?.name : "-"}
                      </a>
                    </span>
                  </div>

                  <div className="pt-1 text-xs w-1/2 inline-flex align-top flex-wrap">
                    <label htmlFor="" className="font-bold w-2/5 min-w-14">
                      % Done:
                    </label>
                    <div className="gap-1 inline-flex align-top w-1/2 min-w-14">
                      <div className="whitespace-nowrap flex flex-wrap pt-1">
                        <div className="w-[100px] h-5 overflow-hidden bg-slate-200 inline-block align-top">
                          <div className="loading-progress bg-lime-100 h-full " style={{ width: `${issue?.done_ratio}px` }}></div>
                        </div>
                        <span className="text-xs inline-block align-top pl-2">{issue?.done_ratio}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div className="pt-1 text-xs flex items-center w-1/2 min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-14">
                      Category:
                    </label>
                    <span className="w-1/2 min-w-14">-</span>
                  </div>
                  <div className="pt-1 text-xs w-1/2 flex items-center min-w-40 flex-wrap">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-24">
                      Estimated time:
                    </label>
                    <span className="w-1/2 min-w-14">{issue?.estimated_hours ? `${issue?.estimated_hours} hours` : "-"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div className="pt-1 text-xs w-1/2 flex flex-wrap min-w-24 items-center">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-24">
                      Target version:
                    </label>
                    <span className="w-1/2 min-w-14">{issue?.fixed_version?.name ? issue?.fixed_version?.name : "-"}</span>
                  </div>
                  <div className="pt-1 text-xs w-1/2 flex flex-wrap min-w-24">
                    <label htmlFor="" className="font-bold  w-2/5 min-w-20">
                      Spent time:
                    </label>
                    <a href="#!" className="link">
                      {issue?.spent_hours ? `${issue?.spent_hours} hours` : "-"}
                    </a>
                  </div>
                </div>

                <div className="flex pb-2 flex-wrap">
                  {issue &&
                    issue.custom_fields &&
                    issue.custom_fields.map((item) => (
                      <div className="pt-1 text-xs w-1/2 flex flex-wrap min-w-24" key={item.id}>
                        <label htmlFor="" className="font-bold  w-2/5 min-w-28">
                          {item.name}:
                        </label>
                        <span className="w-1/2 whitespace-normal min-w-21">{item.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              <hr />
              <div className="flex flex-col py-2 text-left gap-3">
                <label htmlFor="" className="text-sm text-zinc-700 font-bold  inline-block">
                  Description
                </label>
                <div className="text-sm text-zinc-700">{issue?.description ? issue.description : "description is empty"}</div>
              </div>
              <hr className="my-1" />
              <div className="flex items-center justify-between">
                <label htmlFor="" className="py-2 inline-block text-sm text-zinc-700 font-bold">
                  Subtasks
                </label>
                <a href="#!" className="link">
                  Add
                </a>
              </div>

              <hr className="my-1" />
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="py-2 inline-block text-sm text-zinc-700  font-bold">
                    Related issues
                  </label>
                  <a href="#!" className="link" onClick={() => setDisplayRelatedIssue(true)}>
                    Add
                  </a>
                </div>
                {displayRelatedIssue && (
                  <div className="flex gap-1 text-xs font-light items-center">
                    <Select className="text-xs">
                      {RELATED_ISSUE_OPTIONS.map((issue) => {
                        return <option value={issue.value}>{issue.label}</option>;
                      })}
                    </Select>
                    <span className="">Issue #</span>
                    <div className={`flex items-center border ml-1 w-32 ${isActive ? "border-black rounded-sm" : ""}`}>
                      <img src={IconSearch} alt="IconSearch" className="px-1" />
                      <input
                        id="ParentTask"
                        type="text"
                        className="outline-none w-full text-xs py-1"
                        onFocus={() => setIsActive(true)}
                        onBlur={() => setIsActive(false)}
                      />
                    </div>
                    <Button type="button">Add</Button>
                    <a href="#!" className="link" onClick={() => setDisplayRelatedIssue(false)}>
                      Cancel
                    </a>
                    <></>
                  </div>
                )}
              </div>
            </div>
            <div className="text-left px-3 py-1 text-mouse-gray">
              <div className="text-base font-bold pb-1">History</div>
              <div className="pt-1">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <img
                      src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                      alt="Avatar"
                      className="size-8"
                    />
                    <span className="font-bold">
                      Updated by{" "}
                      <a href="" className="link font-bold">
                        Son (internship) Nguyen Hoang Huu
                      </a>{" "}
                      <a href="" className="link font-bold">
                        38 minutes
                      </a>{" "}
                      ago
                    </span>
                  </div>
                  <a className="link font-bold">#1</a>
                </div>

                <ul className="pl-11 text-zinc-700 list-disc">
                  <li className="py-3">
                    <span className="text-sm font-bold">% Done changed</span> from 10 to 70
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr />

          <div className="flex mt-2 gap-2 justify-end pb-2.5 pr-5">
            <button
              onClick={handleNavigateDetail}
              className="border text-blue-gray bg-slate-100 font-bold px-3 py-1 border-gray-300 rounded-md hover:bg-sky-50 hover:border-blue-gray"
            >
              details
            </button>
            <button
              onClick={handleNavigateEdit}
              className="border text-blue-gray a bg-slate-100 font-bold px-3 py-1 border-gray-300 rounded-md hover:bg-sky-50 hover:border-blue-gray"
            >
              edit
            </button>
            <button
              className="border text-blue-gray bg-slate-100 font-bold px-3 py-1 border-gray-300 rounded-md hover:bg-sky-50 hover:border-blue-gray"
              onClick={handleClickOutside}
            >
              close
            </button>
          </div>
        </Rnd>
      </div>
    </>
  );
};

export default Dialog;
