import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import issuesApi from "~/apis/issue.api";
import ModalAddWatchers from "~/pages/IssuesCreate/_components/ModalAddWatchers";
import { User } from "~/types/user.type";

interface Member {
  id: number;
  name: string;
  role: string;
}

const SideBarDetail = ({ idIssue }: { idIssue: number }) => {
  const { id, name, issueId } = useParams();
  const [listWatcherIssue, setListWatcherIssue] = useState<User[] | undefined>([]);
  const [isAddWatcher, setIsAddWatcher] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);

  const fetchWatcherIssue = async () => {
    const response = await issuesApi.getIssueById({ id: Number(issueId), include: ["watchers"] });
    const watchersIssue = response.data.issue?.watchers;
    setListWatcherIssue(watchersIssue);
  };

  useEffect(() => {
    fetchWatcherIssue();
  }, [idIssue]);

  return (
    <>
      {isAddWatcher && <ModalAddWatchers data={members} handleClick={setIsAddWatcher} />}
      <div className="px-3 w-1/4 mt-3 pb-6">
        <div className=" flex flex-col gap-3 p-6 text-xs">
          <>
            <h2 className=" text-mouse-gray font-bold">Issues</h2>
            <div className="text-ocean-blue text-10 flex flex-col gap-0.5">
              <Link to={`/projects/${id}/${name}/issues`}>View all issues</Link>
              <Link to="">Summary</Link>
              <Link to={`/projects/${id}/${name}/issues/calendar`}>Calendar</Link>
              <Link to="">Gantt</Link>
            </div>
          </>
          <div>
            <h2 className=" text-mouse-gray font-bold mb-2">Custom queries</h2>
            <Link className="text-ocean-blue text-10" to="">
              Ticket open by subProject
            </Link>
          </div>
          <div className="flex flex-col gap-1 text-ocean-blue text-10">
            <div className="flex justify-between">
              <h2 className=" text-mouse-gray text-xs font-bold mb-2">Watchers ({listWatcherIssue ? listWatcherIssue.length : 0})</h2>
              <button onClick={() => setIsAddWatcher(true)}>Add</button>
            </div>
            {listWatcherIssue && listWatcherIssue.length
              ? listWatcherIssue.map((watcher) => (
                  <Link key={watcher.id} to="" className="flex items-center gap-1">
                    <img
                      className="size-6 p-1 border bg-white"
                      src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                      alt="avatar"
                    />{" "}
                    {watcher.name}
                  </Link>
                ))
              : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarDetail;
