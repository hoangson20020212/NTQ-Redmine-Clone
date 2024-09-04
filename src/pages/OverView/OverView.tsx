import Document from "~/assets/images/ticket.png";
import Group from "~/assets/images/group.png";
import { useEffect, useState } from "react";
import projectsApi from "~/apis/projects.api";
import issuesApi from "~/apis/issue.api";
import projectMembershipsApi from "~/apis/projectMemberships.api";
import { SyncLoader } from "react-spinners";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Member {
  id: number;
  name: string;
  role: string;
}

interface Accumulator {
  [role: string]: Member[];
}

const Overview = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { id, name } = useParams();
  const [issueTracker, setIssueTracker] = useState<{ [key: string]: number }>({});
  const [members, setMembers] = useState<Member[]>([]);
  const links = [
    { href: "#", text: "View all issues" },
    { href: "#", text: "Calendar" },
    { href: "#", text: "Gantt" },
  ];

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getProjectById({ id: Number(id), include: "trackers" });
      const trackerArray = response.data.project.trackers;
      const listIssuesProject = await issuesApi.listIssues({ project_id: Number(id) });
      const arrayIssues = listIssuesProject.data.issues;

      trackerArray?.forEach((trackerItem) => {
        const count = arrayIssues.filter((item) => item.tracker.name === trackerItem.name).length;
        setIssueTracker((issueTracker) => ({
          ...issueTracker,
          [trackerItem.name]: count,
        }));
      });

      const memberList = await projectMembershipsApi.getProjectMemberships(Number(id));
      const arrayMember = memberList.data.memberships;
      arrayMember.forEach((mem) => {
        setMembers((prevState) => [
          ...prevState,
          {
            id: mem.user.id,
            name: mem.user?.name ?? "",
            role: mem.roles[0]?.name ?? "",
          },
        ]);
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Overview - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="p-2.5 min-h-84 bg-white mt-3 pb-8">
        <h2 className="text-xl font-semibold pt-0.5 pr-3 mb-3 text-mouse-gray">Overview</h2>
        <div className="flex justify-between gap-6 items-center">
          <div className="border bg-[#fcfcfc] p-2.5 w-[50%]">
            <div className="flex gap-1 text-mouse-gray font-bold text-base items-center">
              <img src={Document} alt="Document" className="size-4" />
              <span>Issue tracking</span>
            </div>
            {loading ? (
              <SyncLoader className="ml-4" color="#169" size={4} />
            ) : (
              <ul className="text-xs list-disc text-mouse-gray pl-10 my-3">
                {Object.entries(issueTracker).map(([key, value]) => (
                  <li className="leading-4" key={key}>
                    <span>
                      <a href="#" className="text-ocean-blue mr-1 hover:text-red-600 hover:underline">
                        {`${key}:`}
                      </a>
                      {`${value} open / ${value}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-xs text-mouse-gray my-3">
              <span className="flex">
                {links.map((link, index) => (
                  <div key={index}>
                    <a href={link.href} className="text-ocean-blue hover:text-red-600 hover:underline">
                      {link.text}
                    </a>
                    {index < links.length - 1 && " | "}
                  </div>
                ))}
              </span>
            </div>
          </div>

          <div className="border p-2.5 bg-white w-2/4">
            <div className="flex gap-1 text-mouse-gray font-bold text-base items-center">
              <img src={Group} alt="Group" />
              <span>Member</span>
            </div>
            {loading ? (
              <SyncLoader className="ml-7" color="#169" size={4} />
            ) : (
              <div className="text-xs text-mouse-gray my-4">
                {Object.entries(
                  members.reduce<Accumulator>((acc, item) => {
                    if (!acc[item.role]) {
                      acc[item.role] = [];
                    }
                    acc[item.role].push(item);
                    return acc;
                  }, {}),
                ).map(([key, value]) => (
                  <div key={key}>
                    <span>{key} :</span>
                    {value.map((item, index) => (
                      <Link
                        to={`/projects/${id}/${name}/users/${item.id}`}
                        className="text-ocean-blue hover:text-red-600 hover:underline"
                        key={item.id}
                      >
                        {`${item.name}${index !== value.length - 1 ? "," : ""}`}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
