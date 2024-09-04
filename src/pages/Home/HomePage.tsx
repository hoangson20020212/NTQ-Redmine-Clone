import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import projectsApi from "~/apis/projects.api";
import LatestProject from "~/assets/images/latest-projects.png";
import config from "~/constants/config";
import useScrollToTop from "~/hooks/useScrollToTop";
import { DataProject } from "~/types/project.type";

const HomePage = () => {
  useScrollToTop();

  const fetchProject = async () => {
    const response = await projectsApi.getAllProjects();
    return response?.data?.projects?.map((project: DataProject) => ({
      ...project,
      created_on: moment(project.created_on).format("MM/DD/YYYY hh:mm A"),
    }));
  };
  const { data: listProject = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProject,
    staleTime: config.staleTime,
  });

  return (
    <>
      <Helmet>
        <title>NTQ Redmine</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="pt-1 bg-white min-h-84  mt-3 pb-8">
        <h2 className="text-xl font-semibold pt-0.5 pr-3 mb-3 text-mouse-gray">Home</h2>

        <div className="flex">
          <div className="content-left w-3/6"></div>
          <div className="content-right w-3/6 border-solid border-inherit	border-2 p-2	">
            <div className="flex items-center mb-3">
              <img className="mr-1" src={LatestProject} alt="logo" />
              <p className="text-mouse-gray text-sm font-medium">Latest projects</p>
            </div>
            <div className="pl-10 my-3">
              <ul className="text-mouse-gray text-xs list-disc">
                <SyncLoader loading={isLoading} color="#169" size={5} />
                {listProject.map((item) => (
                  <li key={item.id}>
                    <Link className="text-ocean-blue hover:underline" to={`/projects/${item.id}/${item.name}/overview`}>
                      {item.name}
                    </Link>{" "}
                    ({item.created_on})<p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
