import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import versionsApi from "~/apis/versions.api";
import config from "~/constants/config";
import EditIcon from "~/assets/images/edit-img.png";
import DeleteImg from "~/assets/images/delete-img.png";
import IconSuccess from "~/assets/images/apply-img.png";
import IconAdd from "~/assets/images/icon-add.png";
import { BeatLoader } from "react-spinners";
import { Version } from "~/types/version.type";
import { useGlobalStore } from "~/store/globalStore";
import { useEffect } from "react";
import ToastSuccess from "~/components/ToastSuccess";

const COLUMN_NAME = [
  { name: "version", style: "w-1/5" },
  { name: "date", style: "w-1/6" },
  { name: "description", style: "w-1/12" },
  { name: "status", style: "w-1/12" },
  { name: "sharing", style: "w-1/6" },
  { name: "wiki page", style: "w-1/12	" },
];

const Settings = () => {
  const { name, id } = useParams();
  const navigate = useNavigate();
  const { isSuccessEdit, setIsSuccessEdit } = useGlobalStore((state) => ({
    isSuccessEdit: state.isSuccessEdit,
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

  const fetchVersionOfProject = async () => {
    const responseVersion = await versionsApi.getAllVersionOfProject({ idProject: Number(id) });
    return responseVersion.data.versions;
  };

  const { data: allVersion = [], isLoading } = useQuery({
    queryKey: ["allVersion"],
    queryFn: () => fetchVersionOfProject(),
    staleTime: config.staleTime,
  });

  const handleDeleteVersion = async (id: number) => {
    const userConfirmed = confirm("Are you sure you want to delete?");

    if (userConfirmed) {
      await versionsApi.deleteVersions(id);
      window.location.reload();
    }
  };

  const handleEditVersion = (version: Version) => {
    navigate(`/projects/${id}/${name}/${version.id}/edit`, { state: version });
  };

  useEffect(() => {
    if (isSuccessEdit) {
      fetchVersionOfProject();
      const timer = setTimeout(() => {
        setIsSuccessEdit(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessEdit]);

  return (
    <>
      <Helmet>
        <title>{`Settings - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="border p-2.5 mt-3 bg-white min-h-84 flex flex-col gap-3">
        <h2 className="text-mouse-gray text-xl font-semibold">Settings</h2>
        {isSuccessEdit && <ToastSuccess />}
        <ul className="flex items-center gap-2 text-xs font-semibold text-mouse-gray px-2 border-b border-slate-400">
          <li className="relative bottom-[-6px] border-slate-400 bg-white px-3 pt-1 pb-2 rounded-tl-md rounded-tr-md  border z-10 cursor-pointer border-b-white">
            Version
          </li>
        </ul>
        <table className="w-full table-auto border-collapse border border-gray-4  00">
          <thead>
            <tr className="w-full">
              {COLUMN_NAME.map((columnName) => (
                <th
                  className={`px-5 text-center capitalize border border-solid border-gray-300 border-b-slate-600 text-gray-600 tracking-wider ${columnName.style}`}
                  key={columnName.name}
                >
                  {columnName.name}
                </th>
              ))}
              <th className="w-3/12 text-center capitalize border border-solid border-gray-300 border-b-slate-600 text-gray-600 px-5 tracking-wider"></th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr className="h-7">
                <td className="text-center w-full" colSpan={COLUMN_NAME.length}>
                  <div className="flex justify-center">
                    <BeatLoader color="#169" size={5} />
                  </div>
                </td>
              </tr>
            )}
            {allVersion.length ? (
              allVersion.map((version, index) => (
                <tr
                  key={version.id}
                  className={`text-xs ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${version.status === "closed" ? "opacity-45" : ""} border`}
                >
                  <td className={`cursor-pointer hover:underline ${version.status === "open" ? "text-ocean-blue" : ""}`}>{version.name}</td>
                  <td className="border text-center">{version.due_date}</td>
                  <td className="border" key={version.id}>
                    {version.description}
                  </td>
                  <td className="border text-center">{version.status}</td>
                  <td className="border text-center">{version.sharing}</td>
                  <td className={`cursor-pointer hover:underline ${version.status === "open" ? "text-ocean-blue" : ""}`}>{version.name}</td>
                  <td>
                    <div className="flex w-full gap-2 justify-end">
                      <button className="flex items-center gap-1" onClick={() => handleEditVersion(version)}>
                        <img src={EditIcon} className="w-4" alt="Time add" /> Edit
                      </button>
                      <button className="flex items-center gap-1" onClick={() => handleDeleteVersion(version.id)}>
                        <img alt="delete" className="w-4" src={DeleteImg} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-1">
          <Link className="flex min-w-20 hover:underline" to={`/projects/${id}/${name}/roadmap/newVersion`}>
            <img className="mr-1 w-fit h-fit" src={IconAdd} alt="Add" /> <p className="text-xs">New version</p>
          </Link>
          <button className="flex min-w-20 hover:underline text-xs text-ocean-blue">Close completed versions</button>
        </div>
      </div>
    </>
  );
};

export default Settings;
