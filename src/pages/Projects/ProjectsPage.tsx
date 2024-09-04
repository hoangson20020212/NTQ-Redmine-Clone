import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import projectsApi from "~/apis/projects.api";
import StarImg from "~/assets/images/star-img.png";
import WifiImg from "~/assets/images/wifi-img.png";
import Button from "~/components/Button";
import config from "~/constants/config";
import useScrollToTop from "~/hooks/useScrollToTop";

const ProjectsPage = () => {
  useScrollToTop();

  const fetchProject = async () => {
    const response = await projectsApi.getAllProjects();
    return response?.data?.projects;
  };

  const { data: listProject = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProject,
    staleTime: config.staleTime,
  });

  return (
    <>
      <Helmet>
        <title>Projects - NTQ Redmine</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="flex min-h-84">
        <div className="flex flex-col gap-2.5 bg-white w-9/12 px-3 mt-3 pb-8 border border-solid ">
          <div className="flex justify-between items-center p-1.5">
            <h2 className="text-xl text-mouse-gray font-semibold">Projects</h2>
            <ul className="text-xs flex text-ocean-blue gap-1">
              <Link to="/issues">View all issues</Link> | <Link to="/time_entries">Overall spent time</Link> |
              <Link to="/activity">Overall activity</Link>
            </ul>
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            {listProject.length ? (
              listProject.map((project) => (
                <span className="w-max" key={project.id}>
                  <Link
                    className="text-ocean-blue font-semibold flex gap-1 items-center hover:underline"
                    to={`/projects/${project?.id}/${project.name}/overview`}
                  >
                    {project.id === 323 && <img className="w-fit h-fit" src={StarImg} alt="My project" />}
                    {project?.name}
                  </Link>
                  <p className="text-xs">{project?.description}</p>
                </span>
              ))
            ) : (
              <SyncLoader className="ml-4" loading={isLoading} color="#169" size={5} />
            )}
          </div>
          <div>
            <p className="text-xs flex gap-1 justify-end">
              <img src={StarImg} alt="My project" />
              My projects
            </p>
            <p className="text-xs flex gap-1 justify-end mt-1.5">
              Also available in: <img src={WifiImg} alt="img" />{" "}
              <a className="text-ocean-blue" href="">
                Atom
              </a>
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-3 w-3/12 bg-[#eee] pr-3 pb-8">
          <h2 className="text-sm text-mouse-gray">Projects</h2>
          <div className="flex gap-1 items-center ">
            <input id="view-closed" type="checkbox" />
            <label htmlFor="view-closed" className="text-xs">
              View closed projects
            </label>
          </div>
          <Button className="w-14 ml-0">Apply</Button>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
