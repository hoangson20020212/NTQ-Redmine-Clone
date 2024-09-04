import { useLocation, useParams } from "react-router-dom";
import EditIssueForm from "../EditIssueForm";
import issuesApi from "~/apis/issue.api";
import { CustomFields, Issue } from "~/types/issue.type";
import { useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";

const EditPage = () => {
  const { issueId } = useParams();
  const location = useLocation();
  const { issue, tracker } = location.state;
  const [issueOfId, setIssuesOfId] = useState<Issue>({} as Issue);
  console.log(issueId, tracker);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isActiveEdit, setIsActiveEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIssuesOfProject = async () => {
    try {
      const responseIssueOfId = await issuesApi.getIssueById({ id: Number(issue) ?? Number(issueId), include: ["watchers"] });
      const customFields = responseIssueOfId.data.issue?.custom_fields?.reduce((acc: CustomFields, item) => {
        const formattedName = item.name.replace(/\s+/g, "").replace(/^[a-z]/, (match) => match.toLowerCase());
        if (item.value !== undefined) {
          acc[formattedName] = item.value;
        }
        return acc;
      }, {} as CustomFields);
      setIssuesOfId({ ...responseIssueOfId?.data?.issue, ...customFields });
    } catch (error) {
      console.error("Failed to fetch issue:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchIssuesOfProject();
  }, [issueId]);

  return (
    <div className="flex flex-col gap-2 min-h-84 bg-white border px-3 mt-3">
      <h2 className="text-mouse-gray text-xl     mt-2">
        {tracker} #{issueId}
      </h2>
      {isLoading ? <SyncLoader color="#169" size={5} /> : <EditIssueForm formRef={formRef} dataEdit={issueOfId} setIsActiveEdit={setIsActiveEdit} />}
    </div>
  );
};

export default EditPage;
