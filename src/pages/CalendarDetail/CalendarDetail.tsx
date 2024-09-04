import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import "../MyPage/_components/Calendar/Calendar.css";
import Card from "~/pages/MyPage/_components/Card/Card";
import { groupTasksByExactDate, getDay, getFullWeeksOfMonth, checkDateStatus, getWeekNumber } from "~/utils/utils";
import ApplyImg from "~/assets/images/apply-img.png";
import ReLoadImg from "~/assets/images/reload-img.png";
import { Issue } from "~/types/issue.type";
import { SyncLoader } from "react-spinners";
import issuesApi from "~/apis/issue.api";
import { useQuery } from "@tanstack/react-query";
import config from "~/constants/config";
import moment from "moment";
import Filter from "../MyPage/_components/Filter";
import Label from "~/components/Label";
import Input from "~/components/Input";
import ArrowLeftIcon from "~/assets/images/arrow_left.png";
import ArrowRightIcon from "~/assets/images/arrow_right.png";
import DiamondIcon from "~/assets/images/bullet_diamond.png";

const fetchListIssue = async (): Promise<Issue[]> => {
  const response = await issuesApi.listIssues();
  return response.data.issues;
};

const CalendarDetail = () => {
  const { name, id } = useParams();

  const currentMonth = moment().month() + 1;
  const currentYear = moment().year();
  const fullWeeksOfMonth = getFullWeeksOfMonth(currentMonth, currentYear);

  const { data: listIssues = [], isLoading } = useQuery({
    queryKey: ["listIssues"],
    queryFn: fetchListIssue,
    staleTime: config.staleTime,
  });

  return (
    <div className="flex gap-5">
      <Helmet>
        <title>{`Calendar - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className=" flex flex-col gap-3 bg-white px-3 mt-3 pb-8 min-h-84 w-9/12">
        <h2 className="mt-3 text-base text-mouse-gray font-bold">Calendar</h2>
        <Filter />
        <div className="flex gap-2 items-center">
          <Label htmlFor="month">Month</Label>
          <Input id="month" className="text-xs" type="month" defaultValue={moment().format("YYYY-MM")} />
          <button className="flex gap-1 text-xs hover:underline">
            <img src={ApplyImg} alt="apply" /> Apply
          </button>
          <button className="flex gap-1 text-xs hover:underline">
            <img src={ReLoadImg} alt="apply" /> Clear
          </button>
        </div>
        <SyncLoader loading={isLoading} color="#169" size={5} />

        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="w-[22px] p-1"></th>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            {fullWeeksOfMonth.map((weekDays, weekIndex) => {
              const mainArrays = groupTasksByExactDate(listIssues, weekDays);
              const dateOfWeek = moment(weekDays[0], "YYYY-MM-DD").toDate();
              const week = getWeekNumber(dateOfWeek)[1];
              return (
                <tr key={weekIndex} className="h-32 w-44">
                  <td className="text-xs w-[22px] p-1 text-mouse-gray ">{week + 1}</td>
                  {weekDays.map((daysOfWeek, dayIndex) => {
                    const day = moment(daysOfWeek).format("D");
                    const issues = mainArrays.find((item) => Object.keys(item)[0] === day);
                    const isCurrentDay = getDay() === day;

                    return (
                      <td key={dayIndex} className={`${isCurrentDay ? "bg-light-yellow" : ""} hover:bg-light-yellow relative  text-xs`}>
                        <div className={`${isCurrentDay ? "font-bold" : ""} text-right text-mouse-gray absolute top-1 right-1`}>
                          {moment(daysOfWeek).date()}
                        </div>
                        {issues &&
                          issues[day]?.map((issue) => (
                            <div key={issue.id} className="py-1">
                              <div className="flex gap-1 flex-wrap p-1.5 w-full text-10 text-mouse-gray bg-light-yellow border relative card">
                                <span>
                                  <img src={checkDateStatus({ startDate: issue.start_date, dueDate: issue.due_date, day })} alt="ArrowRightIcon" />
                                </span>
                                <a href="#!" className="text-ocean-blue ">
                                  {issue.tracker.name} #{issue.id}:
                                </a>
                                <p>{issue.subject}</p>
                                <Card issue={issue} day={day} />
                              </div>
                            </div>
                          ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-xs">
          <p className="flex gap-1">
            <img src={ArrowLeftIcon} alt="ArrowLeftIcon" />
            issue beginning this day
          </p>
          <p className="flex gap-1">
            <img src={ArrowRightIcon} alt="ArrowRightIcon" />
            issue ending this day
          </p>
          <p className="flex gap-1">
            <img src={DiamondIcon} alt="DiamondIcon" />
            issue beginning and ending this day
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-3 mt-5 pb-8 text-mouse-gray text-xs">
        <>
          <h2>Issues</h2>
          <Link className="mt-3 hover:underline text-ocean-blue" to={`/projects/${id}/${name}/issues`}>
            View all issues
          </Link>
          <Link className=" hover:underline text-ocean-blue" to="">
            Summary
          </Link>
          <Link className="hover:underline text-ocean-blue" to="">
            Calendar
          </Link>
          <Link className="hover:underline text-ocean-blue" to="">
            Gantt
          </Link>
        </>
        <>
          <h2 className="mt-5">Custom queries</h2>
          <Link className="mt-3 hover:underline text-ocean-blue" to="">
            Ticket open by subProject
          </Link>
        </>
      </div>
    </div>
  );
};

export default CalendarDetail;
