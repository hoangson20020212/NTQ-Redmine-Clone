import Document from "~/assets/images/ticket.png";
import SpentTime from "~/assets/images/time.png";
import Atom from "~/assets/images/wifi-img.png";
import Edit from "~/assets/images/wiki_edit.png";
import Button from "~/components/Button";
import issuesApi from "~/apis/issue.api";
import wikiApi from "~/apis/wiki.api";
import timeEntriesApi from "~/apis/timeEntries.api";
import { SyncLoader } from "react-spinners";
import { Wiki } from "~/types/wiki.type";
import { TimeEntries } from "~/types/timeEntries.type";
import { convertDateFormat } from "~/utils/utils";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Issue } from "~/types/issue.type";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { handleFormatTime, handleFormatDate } from "~/utils/utils";

type DataGeneral = {
  title: string;
  type: string;
  description?: string;
  author: {
    id: number;
    name: string;
  };
  created_on: string;
};

const Activity = () => {
  const { id, name } = useParams();
  const { t } = useTranslation("activity");

  const [dateEnd, setDateEnd] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dateStart, setDateStart] = useState<string>(new Date(new Date(dateEnd).setDate(new Date().getDate() - 29)).toISOString().split("T")[0]);
  const [isDisplayNext, setIsDisplayNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState<Record<string, DataGeneral[]>>({});
  const [isNoData, setIsNoData] = useState(false);
  const [data, setData] = useState<DataGeneral[]>([]);

  const [activity, setActivity] = useState([
    { name: "issues", label: t("activity_options.issues"), checked: true },
    { name: "changesets", label: t("activity_options.changesets"), checked: true },
    { name: "documents", label: t("activity_options.documents"), checked: true },
    { name: "files", label: t("activity_options.files"), checked: true },
    { name: "wikiEdits", label: t("activity_options.wiki_edits"), checked: false },
    { name: "spentTime", label: t("activity_options.spent_time"), checked: false },
  ]);

  const handlePrevious = () => {
    const newDateStart = new Date(dateStart);
    newDateStart.setDate(newDateStart.getDate() - 30);
    setDateStart(newDateStart.toISOString().split("T")[0]);
    const newDateEnd = new Date(dateEnd);
    setIsDisplayNext(true);
    newDateEnd.setDate(newDateEnd.getDate() - 30);
    setDateEnd(newDateEnd.toISOString().split("T")[0]);
  };

  const handleNext = () => {
    const newDateStart = new Date(dateStart);
    newDateStart.setDate(newDateStart.getDate() + 30);
    setDateStart(newDateStart.toISOString().split("T")[0]);
    const newDateEnd = new Date(dateEnd);
    newDateEnd.setDate(newDateEnd.getDate() + 30);
    const today = new Date();
    if (today.getDate() === newDateEnd.getDate() && today.getMonth() === newDateEnd.getMonth() && today.getFullYear() === newDateEnd.getFullYear()) {
      setIsDisplayNext(false);
      setDateEnd(today.toISOString().split("T")[0]);
    } else {
      setDateEnd(newDateEnd.toISOString().split("T")[0]);
    }
  };

  const handleIconOfData = (type: string) => {
    switch (type) {
      case "spentTime":
        return SpentTime;
      case "issues":
        return Document;
      case "wikiEdits":
        return Edit;
    }
  };

  const handleChange = (index: number) => {
    const newActivity = [...activity];
    newActivity[index].checked = !newActivity[index].checked;
    setActivity(newActivity);
  };

  const handleApply = (data: DataGeneral[]) => {
    const filterMapping: { index: number; type: string }[] = [
      { index: 0, type: "issues" },
      { index: 4, type: "wikiEdits" },
      { index: 5, type: "spentTime" },
    ];

    const arrayItem = filterMapping.reduce((acc: DataGeneral[], { index, type }) => {
      if (activity[index].checked) {
        return [...acc, ...data.filter((item) => item.type === type)];
      }
      return acc;
    }, []);

    setIsNoData(!arrayItem.length);

    const listData = arrangeListByDate(arrayItem);
    setListData(listData);
  };

  const handleClickActivity = (index: number) => {
    const newlisData = data.filter((item) => item.type === activity[index].name);
    const listData = arrangeListByDate(newlisData);
    setListData(listData);

    const newActivity = activity.map(
      (item, i) =>
        i === index
          ? { ...item, checked: true } // Nếu đúng index thì thay đổi checked
          : { ...item, checked: false }, // Nếu không đúng thì đặt checked = false
    );

    setActivity(newActivity);
  };

  const convertListIssue = (listItem: Issue[]): DataGeneral[] => {
    const newList = listItem.map((item) => ({
      title: `${item.tracker.name} #${item.id} (${item.status.name}): ${item.subject}`,
      type: "issues",
      description: item.description,
      author: {
        id: item.author.id,
        name: item.author.name,
      },
      created_on: item.created_on,
    }));

    return newList;
  };

  const convertListWiki = (listItem: Wiki[]): DataGeneral[] => {
    const newList = listItem.map((item) => ({
      title: `${item.title} edit: ${item.title} (#${item.version})`,
      type: "wikiEdits",
      description: "",
      author: {
        id: +item.author.id,
        name: item.author.name,
      },
      created_on: item.created_on,
    }));

    return newList;
  };

  const convertListTimeEntries = (listItem: TimeEntries[], anotherListItem: Issue[]): DataGeneral[] => {
    const newList = listItem.map((item) => {
      const issues = anotherListItem.find((issue: Issue) => issue?.id === item?.issue?.id);
      return {
        title: issues
          ? `${item.hours} hours (${issues?.tracker.name} #${item.issue.id}(${issues?.status.name}): ${issues?.subject} )`
          : `${item.hours} hours (Project: ${item.project.name}) `,
        type: "spentTime",
        description: item.comments,
        author: {
          id: +item.user.id,
          name: item.user.name,
        },
        created_on: item.created_on,
      };
    });

    return newList;
  };

  const arrangeListByDate = (listItem: DataGeneral[]): Record<string, DataGeneral[]> => {
    const newList = listItem.reduce((acc: Record<string, DataGeneral[]>, item) => {
      const date = handleFormatDate(item.created_on);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
    return newList;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let arrayItem: DataGeneral[] = [];
      //Issue
      const responseIssue = await issuesApi.listIssues({ project_id: Number(id), created_on: `><${dateStart}|${dateEnd}` });
      const issueConvert = convertListIssue(responseIssue.data.issues);

      //Wiki
      const responseWikis = await wikiApi.getAllWikiProject({ project_id: Number(id) });
      const wikiData = await wikiApi.getWikiProject({ project_id: Number(id), name: responseWikis.data.wiki_pages[0].title });
      const wikiDataConvert = convertListWiki([wikiData.data.wiki_page]);

      //TimeEntries
      const responseTimeEntries = await timeEntriesApi.listTimeEntries({ project_id: Number(id), from: dateStart, to: dateEnd });
      const timeEntriesConvert = convertListTimeEntries(responseTimeEntries.data.time_entries, responseIssue.data.issues);

      arrayItem = [...arrayItem, ...issueConvert, ...wikiDataConvert, ...timeEntriesConvert];
      setData(arrayItem);
      handleApply(arrayItem);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateEnd, dateStart]);

  return (
    <>
      <Helmet>
        <title>{`Activity - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="pt-2.5 flex">
        <div className="bg-white w-3/4 min-h-[70vh] px-3 pt-2 border-neutral-300 border">
          <div className="text-xl font-semibold pt-0.5 pr-3 text-mouse-gray">{t("title")}</div>
          <>
            <span className="text-gray-rain text-10 italic inline-block mb-4">{`${t("from")} ${convertDateFormat(dateStart)} ${t("to")} ${convertDateFormat(dateEnd)}`}</span>
            {isLoading ? (
              <SyncLoader color="#169" size={5} />
            ) : isNoData ? (
              <div className="border-2 border-[#fdbf3b] bg-[#ffebc1] text-[#b7793b] text-sm w-full py-1 text-center">{t("no_data_notify")}</div>
            ) : (
              <div className="">
                {Object.keys(listData).map((date) => (
                  <div key={date}>
                    <h3 className="text-mouse-gray text-base font-bold mb-3">{date}</h3>
                    {listData[date].map((issue: any) => (
                      <div className="flex gap-3 ml-6 mb-3" key={issue.title}>
                        <div className="flex gap-1">
                          <img src={handleIconOfData(issue.type)} alt="Icon" className="size-4" />
                          <img
                            src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                            alt="Avatar"
                            className="object-cover size-8 border p-0.5 border-stone-300"
                          />
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center leading-4 gap-1">
                            <span className="text-10 text-mouse-gray">{handleFormatTime(issue.created_on)}</span>
                            <a href="#!" className="link text-xs">
                              {issue.title}
                            </a>
                          </div>
                          <div className="text-10 text-zinc-500 italic leading-3">{issue?.description}</div>
                          <div className="leading-3">
                            <a href="#!" className="link text-10">
                              {issue.author.name}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
          <div className="py-4">
            <div className="flex text-xs justify-between">
              <a href="#!" className="link" onClick={handlePrevious}>
                {t("button_apply.previous")}
              </a>
              {isDisplayNext && (
                <a href="#!" className="link" onClick={handleNext}>
                  {t("button_apply.next")}
                </a>
              )}
            </div>
            <div className="flex items-center justify-end pt-2 text-10 leading-3 gap-1 text-mouse-gray">
              <span>{t("other_format_notify")}</span>
              <img src={Atom} alt="Atom" />
              <a href="#!" className="link text-10">
                Atom
              </a>
            </div>
          </div>
        </div>
        <div className="pt-4 pl-2">
          <h3 className="text-mouse-gray text-sm font-bold">{t("title")}</h3>

          <div className="flex flex-col my-2 pl-3">
            {activity.map((item, index) => (
              <label key={item.name} className="flex items-center gap-1">
                <input type="checkbox" checked={item.checked} onChange={() => handleChange(index)} />
                <a href="#!" className="link" onClick={() => handleClickActivity(index)}>
                  {item.label}
                </a>
              </label>
            ))}
          </div>

          <Button onClick={() => handleApply(data)}>{t("button_apply.apply")}</Button>
        </div>
      </div>
    </>
  );
};

export default Activity;
