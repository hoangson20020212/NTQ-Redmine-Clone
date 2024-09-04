import React, { useEffect, useState } from "react";
import IconPencil from "~/assets/images/edit-img.png";
import IconStar from "~/assets/images/star-img.png";
import IconTimeAdd from "~/assets/images/time_add.png";
import IconCopy from "~/assets/images/copy.png";
import IconDelete from "~/assets/images/delete-img.png";
import Menu from "./_components/Menu";
import issuesApi from "~/apis/issue.api";
import Loading from "../Loading";
import { IssueEdit } from "~/types/issue.type";
import { useGlobalStore } from "~/store/globalStore";

interface ItemProps {
  icon?: string;
  name: string;
  children?: ItemProps[];
  onClick?: () => void;
  isChoose?: boolean;
}

interface PropsComponent {
  id: number;
  setClickedPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const ContextMenu: React.FC<PropsComponent> = ({ id, setClickedPosition }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsSuccessEdit } = useGlobalStore((state) => ({
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

  const [data, setData] = useState<ItemProps[]>([
    {
      icon: IconPencil,
      name: "Edit",
      onClick: () => {
        console.log("Fair");
      },
    },
    {
      name: "Status",
      children: [
        { name: "New" },
        { name: "In Progress" },
        { name: "Pending" },
        { name: "Feedback" },
        { name: "Resolved" },
        { name: "Build" },
        { name: "Closed" },
        { name: "Rejected" },
        { name: "Release OK " },
      ],
    },
    {
      name: "Tracker",
      children: [
        {
          name: "Task",
          onClick: () => {
            UpdateIssuesByID({ tracker_id: 4 });
          },
        },
        {
          name: "Bug",
          onClick: () => {
            UpdateIssuesByID({ tracker_id: 1 });
          },
        },
      ],
    },
    {
      name: "Priority",
      children: [
        {
          name: "Immediate",
          onClick: () => {
            UpdateIssuesByID({ priority_id: 5 });
          },
        },
        {
          name: "Urgent",
          onClick: () => {
            UpdateIssuesByID({ priority_id: 4 });
          },
        },
        {
          name: "High",
          onClick: () => {
            UpdateIssuesByID({ priority_id: 3 });
          },
        },
        {
          name: "Normal",
          onClick: () => {
            UpdateIssuesByID({ priority_id: 2 });
          },
        },
        {
          name: "Low",
          onClick: () => {
            UpdateIssuesByID({ priority_id: 1 });
          },
        },
      ],
    },
    {
      name: "Done",
      children: [
        {
          name: "0%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 0 });
          },
        },
        {
          name: "10%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 10 });
          },
        },
        {
          name: "20%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 20 });
          },
        },
        {
          name: "30%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 30 });
          },
        },
        {
          name: "40%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 40 });
          },
        },
        {
          name: "50%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 50 });
          },
        },
        {
          name: "60%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 60 });
          },
        },
        {
          name: "70%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 70 });
          },
        },
        {
          name: "80%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 80 });
          },
        },
        {
          name: "90%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 90 });
          },
        },
        {
          name: "100%",
          onClick: () => {
            UpdateIssuesByID({ done_ratio: 100 });
          },
        },
      ],
    },
    { icon: IconStar, name: "Unwatch" },
    { icon: IconTimeAdd, name: "Log time" },
    { icon: IconCopy, name: "Copy" },
    {
      icon: IconDelete,
      name: "Delete",
      onClick: () => {
        console.log("Delete", id);
      },
    },
    { name: "Quick View" },
  ]);

  const UpdateIssuesByID = async (data: IssueEdit) => {
    const responses = await issuesApi.updateIssue(id, data);
    console.log(responses);
    if (responses.status === 200) {
      setIsSuccessEdit(true);
      setClickedPosition(null);
    }
  };

  const updateData = (obj: { [key: string]: string }, dataNew: ItemProps[]) => {
    const updatedData = dataNew.map((item) => {
      const key = item.name.toLowerCase();
      if (obj[key]) {
        const updatedChildren = item.children
          ? item.children.map((child) => {
              if (child.name === obj[key]) {
                return { ...child, isChoose: true };
              }
              return child;
            })
          : [];
        return { ...item, children: updatedChildren };
      }

      return item;
    });

    setData(updatedData);
  };

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await issuesApi.getIssueById({ id: id });
      const issue = response.data.issue;

      const obj: { [key: string]: string } = {
        tracker: issue.tracker.name,
        status: issue.status.name,
        priority: issue.priority.name,
        done: `${issue.done_ratio.toString()}%`,
      };
      updateData(obj, data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  return <div className="bg-[#fff] relative z-50">{loading ? <Loading /> : <Menu items={data} />}</div>;
};

export default ContextMenu;
