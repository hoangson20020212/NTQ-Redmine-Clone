import { Link, useParams } from "react-router-dom";
import IconAdd from "~/assets/images/icon-add.png";
import IconSuccess from "~/assets/images/apply-img.png";
import PackageImg from "~/assets/images/package-img.png";
import useScrollToTop from "~/hooks/useScrollToTop";
import ProgressBar from "./_components/ProgressBar";
import React, { useEffect, useState } from "react";
import versionsApi from "~/apis/versions.api";
import moment from "moment";
import { SyncLoader } from "react-spinners";
import issuesApi from "~/apis/issue.api";
import SideBar from "./_components/SideBar";
import { CheckBoxRoadMap } from "~/types/utils.type";
import config from "~/constants/config";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "~/types/issue.type";
import Dialog from "../MyPage/_components/Dialog";
import { Helmet } from "react-helmet-async";
import { useGlobalStore } from "~/store/globalStore";
import ToastSuccess from "~/components/ToastSuccess";

const Roadmap = () => {
  const [isCheckedBoxRoadmap, setIsCheckedBoxRoadmap] = useState<CheckBoxRoadMap>({
    task: true,
    bug: false,
    showComplete: false,
  });
  const { id, name } = useParams();
  const currentDate = moment();
  const [activeItem, setActiveItem] = useState<number>(1);
  const { isSuccessEdit, setIsSuccessEdit } = useGlobalStore((state) => ({
    isSuccessEdit: state.isSuccessEdit,
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

  useScrollToTop();

  const fetchIssuesOfVersion = async () => {
    const responseIssues = await issuesApi.listIssues({ project_id: Number(id), fixed_version_id: "*" });
    if (responseIssues?.data?.issues.length) {
      return responseIssues?.data?.issues;
    }
    return [];
  };

  const { data: listIssuesOfVersion = [] } = useQuery({
    queryKey: ["issuesVersion"],
    queryFn: fetchIssuesOfVersion,
    staleTime: config.staleTime,
  });

  const fetchVersionOfProject = async (issues: Issue[]) => {
    const responseVersion = await versionsApi.getAllVersionOfProject({ idProject: Number(id) });
    const listData =
      responseVersion.data.versions &&
      responseVersion.data.versions.map((version) => {
        const issuesOfVersion = issues.filter((issue) => issue?.fixed_version?.id === version.id);
        // if ( version.due_date) {
        const dueDate = moment(version.due_date, "YYYY-MM-DD");
        const difference = currentDate.diff(dueDate, "days");
        // }
        // const difference = dueDate.diff(currentDate, "days");

        return {
          ...version,
          daysLate: difference,
          issues: issuesOfVersion,
        };
      });
    return listData;
  };

  const { data: listVersionOfProject = [], refetch: refetchVersions } = useQuery({
    queryKey: ["versionProjects"],
    queryFn: () => fetchVersionOfProject(listIssuesOfVersion),
    staleTime: config.staleTime,
    enabled: false,
  });

  console.log(listVersionOfProject);

  useEffect(() => {
    if (listIssuesOfVersion.length > 0) {
      refetchVersions();
    }
  }, [listIssuesOfVersion]);

  useEffect(() => {
    const storedData = localStorage.getItem("isCheckedBoxRoadmap");
    if (storedData) {
      let parsedData;
      try {
        parsedData = JSON.parse(storedData);
      } catch (e) {
        console.log(e);
      }

      setIsCheckedBoxRoadmap(
        typeof parsedData === "object" &&
          parsedData !== null &&
          typeof parsedData.task === "boolean" &&
          typeof parsedData.bug === "boolean" &&
          typeof parsedData.showComplete === "boolean"
          ? parsedData
          : { task: true, bug: false, showComplete: false },
      );
    }
  }, []);

  useEffect(() => {
    if (isSuccessEdit) {
      const timer = setTimeout(() => {
        setIsSuccessEdit(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessEdit]);

  const handleApply = (data: CheckBoxRoadMap) => {
    setIsCheckedBoxRoadmap(data);
    localStorage.setItem("isCheckedBoxRoadmap", JSON.stringify(data));
  };

  const handleMouseDown = (index: number) => {
    setActiveItem(index);
  };

  return (
    <>
      <Helmet>
        <title>{`Roadmap - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>

      <div className="flex min-h-84">
        <div className="flex flex-col gap-2.5 bg-white w-9/12 px-3 mt-3 pb-8 border border-solid ">
          {isSuccessEdit && <ToastSuccess />}

          <div className="flex justify-between items-center p-1.5">
            <h2 className="text-xl text-mouse-gray font-semibold">Roadmap</h2>
            <Link className="flex min-w-20 hover:underline" to={`/projects/${id}/${name}/roadmap/newVersion`}>
              <img className="mr-1 w-fit h-fit" src={IconAdd} alt="Add" /> <p className="text-xs">New version</p>
            </Link>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            {listVersionOfProject.length ? (
              listVersionOfProject.map((version) => {
                if (version.status === "closed" && !isCheckedBoxRoadmap.showComplete) {
                  return null;
                }
                return (
                  <React.Fragment key={version.id}>
                    <Link className="flex gap-1	min-w-20 hover:underline items-center" to="" title="ds">
                      <img className="mr-1 w-fit h-fit" src={PackageImg} alt="package" />
                      <p className="text-base text-ocean-blue font-semibold">{version.name}</p>
                    </Link>
                    <p className="text-sm text-gray-700 flex gap-1">
                      {version.daysLate} days late <p className="text-xs">({version.due_date})</p>
                    </p>
                    <p className="text-xs">{version.description}</p>
                    {version?.issues?.length ? (
                      <div className="w-1/2">
                        <ProgressBar issues={version.issues} />
                      </div>
                    ) : (
                      <></>
                    )}

                    <div>
                      <p className="text-xs mb-1">Related issues</p>
                      {version.issues?.length ? (
                        version.issues.map((issue) => {
                          const shouldDisplayTask = isCheckedBoxRoadmap.task && issue.tracker.name === "Task";
                          const shouldDisplayBug = isCheckedBoxRoadmap.bug && issue.tracker.name === "Bug";
                          const content = (
                            <div
                              className="flex cursor-pointer gap-1 text-xs border border-gray-200 p-1 hover:bg-light-yellow mr-1"
                              onClick={() => {}}
                            >
                              <p className="text-ocean-blue hover:underline">{`${issue.tracker.name} #${issue.id}:`}</p> {issue.subject}
                            </div>
                          );
                          if (shouldDisplayTask || shouldDisplayBug) {
                            return (
                              <React.Fragment key={issue.id}>
                                <Dialog
                                  content={content}
                                  issueId={issue.id}
                                  handleClick={handleMouseDown}
                                  ZIndex={activeItem === issue.id ? 40 : 30}
                                />
                              </React.Fragment>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <p className="text-10">No issues for this version</p>
                      )}
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <SyncLoader className="ml-4" loading={true} color="#169" size={5} />
            )}
          </div>
        </div>
        <SideBar listVersionOfProject={listVersionOfProject} handleApply={handleApply} />
      </div>
    </>
  );
};

export default Roadmap;
