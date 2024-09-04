import { useState } from "react";
import Filter from "../MyPage/_components/Filter";
import { Link } from "react-router-dom";
import IconAdd from "~/assets/images/icon-add.png";
import ApplyImg from "~/assets/images/apply-img.png";
import ReLoadImg from "~/assets/images/reload-img.png";
import DetailTimeEntries from "./_components/DetailTimeEntries";
import ReportTimeEntries from "./_components/ReportTimeEntries";
import Option from "~/components/Option";
import { Helmet } from "react-helmet-async";

const TimeEntry = () => {
  const [tabActive, setTabActive] = useState<boolean>(true);
  const [columnName, setColumnName] = useState<string[]>(["project", "date", "user", "issues", "activity", "comment", "hours"]);
  const [midColumnName, setMidColumnName] = useState<string[]>(["project", "date", "user", "issues", "activity", "comment", "hours"]);

  const handleApply = () => {
    setColumnName(midColumnName);
  };

  const onChangeOptions = (optionArray: string[]) => {
    setMidColumnName(optionArray);
  };

  return (
    <>
      <Helmet>
        <title>{`Spent time - Detail - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex justify-between items-center text-ocean-blue">
          <a className="text-xs hover:underline cursor-pointer">
            All project <span className="text-[8px]">&gt;&gt;</span>
          </a>
          <Link className="flex	min-w-20 hover:underline" to="/time_entries/new">
            <img className="mr-1 w-fit h-fit" src={IconAdd} alt="Add" /> <p className="text-xs">log time</p>
          </Link>
        </div>
        <h2 className="text-base text-mouse-gray font-bold">Spent time</h2>
        <Filter />
        <Option onChangeOptions={onChangeOptions} />
        <div className="flex text-xs gap-2 ">
          <button className="flex gap-1 hover:underline" onClick={handleApply}>
            <img src={ApplyImg} alt="apply" /> Apply
          </button>
          <button className="flex gap-1 hover:underline">
            <img src={ReLoadImg} alt="apply" /> Clear
          </button>
        </div>

        <ul className="flex items-center gap-2 text-xs font-semibold text-mouse-gray px-2 border-b">
          <li
            onClick={() => setTabActive(true)}
            className={`relative bottom-[-1px] rounded-tl-md rounded-tr-md p-1 border z-10 cursor-pointer ${tabActive ? "border-b-white" : "bg-slate-100 text-gray-400 hover:bg-yellow-custom-10"}`}
          >
            Detail
          </li>
          <li
            onClick={() => setTabActive(false)}
            className={`relative bottom-[-1px] rounded-tl-md rounded-tr-md p-1 border z-10 cursor-pointer ${!tabActive ? "border-b-white" : "bg-slate-100 text-gray-400 hover:bg-yellow-custom-10"}`}
          >
            Report
          </li>
        </ul>
        {tabActive ? <DetailTimeEntries columnNames={columnName} /> : <ReportTimeEntries />}
      </div>
    </>
  );
};

export default TimeEntry;
