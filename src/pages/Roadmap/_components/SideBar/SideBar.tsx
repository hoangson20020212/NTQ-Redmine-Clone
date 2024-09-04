import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowCollapsed from "~/assets/images/arrow_collapsed.png";
import ArrowExpanded from "~/assets/images/arrow_expanded.png";
import Button from "~/components/Button";
import { CheckBoxRoadMap } from "~/types/utils.type";
import { Version } from "~/types/version.type";

interface SideBarProps {
  listVersionOfProject: Version[];
  handleApply: (data: CheckBoxRoadMap) => void;
}

const SideBar: React.FC<SideBarProps> = ({ listVersionOfProject, handleApply }) => {
  const [isCheckBoxShowVersion, setIsCheckBoxShowVersion] = useState<boolean>(false);
  const [isShowComplete, setIsShowComplete] = useState<boolean>(false);
  const [isCheckedBoxRoadmap, setIsCheckedBoxRoadmap] = useState<CheckBoxRoadMap>({
    task: true,
    bug: false,
    showComplete: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedBoxRoadmap((prev) => ({ ...prev, [event.target.name]: event.target.checked }));
  };

  const handleClickDragDown = () => {
    setIsShowComplete((prevIsShowComplete) => !prevIsShowComplete);
  };

  const handleClickApply = () => {
    handleApply(isCheckedBoxRoadmap);
    setIsCheckBoxShowVersion(isCheckedBoxRoadmap.showComplete);
    localStorage.setItem("isCheckedBoxRoadmap", JSON.stringify(isCheckedBoxRoadmap));
    localStorage.setItem("IsCheckBoxShowVersion", JSON.stringify(isCheckedBoxRoadmap.showComplete));
  };

  useEffect(() => {
    const storedDataVersion = localStorage.getItem("IsCheckBoxShowVersion");
    const storedData = localStorage.getItem("isCheckedBoxRoadmap");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
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
    setIsCheckBoxShowVersion(storedDataVersion && typeof JSON.parse(storedDataVersion) === "boolean" ? JSON.parse(storedDataVersion) : false);
  }, []);

  return (
    <div className="p-8 flex flex-col gap-3 w-3/12 bg-[#eee] pr-3 pb-8">
      <h2 className="text-sm text-mouse-gray">Roadmap </h2>
      <div>
        <div className="flex gap-1 items-center ">
          <input id="bug" type="checkbox" name="bug" checked={isCheckedBoxRoadmap.bug} onChange={handleCheckboxChange} />
          <label htmlFor="bug" className="text-xs">
            Bug
          </label>
        </div>
        <div className="flex gap-1 items-center ">
          <input id="task" type="checkbox" name="task" checked={isCheckedBoxRoadmap.task} onChange={handleCheckboxChange} />
          <label htmlFor="task" className="text-xs">
            Task
          </label>
        </div>
      </div>
      <div className="flex gap-1 items-center ">
        <input id="show" type="checkbox" name="showComplete" checked={isCheckedBoxRoadmap.showComplete} onChange={handleCheckboxChange} />
        <label htmlFor="show" className="text-xs">
          Show completed versions
        </label>
      </div>
      <Button className="w-14 ml-0" onClick={handleClickApply}>
        Apply
      </Button>
      <h2 className="text-sm text-mouse-gray">Versions </h2>
      <>
        {!isCheckBoxShowVersion ? (
          <>
            {listVersionOfProject.map(
              (version) =>
                version.status !== "closed" && (
                  <Link key={version.id} className="text-ocean-blue hover:underline text-xs" to="">
                    {version.name}
                  </Link>
                ),
            )}
            <div className="flex items-center cursor-pointer" onClick={handleClickDragDown}>
              <div className="text-gray-700">
                <img src={isShowComplete ? ArrowExpanded : ArrowCollapsed} alt="icon expend" />
              </div>
              <span className="text-xs text-gray-rain">Completed versions</span>
            </div>
            {isShowComplete &&
              listVersionOfProject.map(
                (version) =>
                  version.status === "closed" && (
                    <Link key={version.id} className="text-ocean-blue hover:underline text-xs" to="">
                      {version.name}
                    </Link>
                  ),
              )}
          </>
        ) : (
          <>
            {listVersionOfProject.map((version) => (
              <Link key={version.id} className="text-ocean-blue hover:underline text-xs" to="">
                {version.name}
              </Link>
            ))}
          </>
        )}
      </>
    </div>
  );
};

export default SideBar;
