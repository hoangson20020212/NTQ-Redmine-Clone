import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import FormAddFile from "./_components/FormAddFile";
import EditIcon from "~/assets/images/edit-img.png";
import StarIcon from "~/assets/images/star-img.png";
import DeleteIcon from "~/assets/images/delete-img.png";
import HistoryIcon from "~/assets/images/history.png";
import Attachment from "~/assets/images/attachment.png";
import Preview from "~/assets/images/preview.png";
// import Attachment from "~/assets/images/attachment.png";

import { useState } from "react";

const OPTION_RIGHT: { id: number; title: string; icon: string }[] = [
  {
    id: 0,
    title: "Edit",
    icon: EditIcon,
  },
  {
    id: 1,
    title: "Watch",
    icon: StarIcon,
  },
  {
    id: 2,
    title: "Delete",
    icon: DeleteIcon,
  },
  {
    id: 3,
    title: "History",
    icon: HistoryIcon,
  },
];

const Wiki = () => {
  const { name } = useParams();
  const [isAddFile, setIsAddFile] = useState<boolean>(false);

  return (
    <div className="flex gap-4">
      <Helmet>
        <title>{`Wiki - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="border p-2.5 mt-3 w-9/12 bg-white min-h-84 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-mouse-gray text-title text-xl font-semibold">Wiki</h2>
          <ul className="flex items-center gap-1 text-xs text-ocean-blue">
            {OPTION_RIGHT.map((option) => (
              <li key={option.id} className="flex items-center gap-1 hover:underline hover:text-hoverText cursor-pointer">
                <img src={option.icon} alt={option.title} className="w-4 h-4" />
                <a>{option.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <ul>
          <li className="flex items-center text-xs gap-1">
            <button className="flex items-center cursor-pointer text-primaryText hover:underline hover:text-hoverText">
              <img src={Attachment} alt="attachment" />
              12345.jpg
            </button>
            <span>(47.6 KB)</span>
            <img src={Preview} alt="preview" className="w-4 h-4 object-contain" />
            <p className="text-gray-400">Dung Nguyen Van 6 (Internship), 07/15/2024 02:04 PM</p>
          </li>
          <li className="flex items-center text-xs gap-1">
            <button className="flex items-center cursor-pointer text-primaryText hover:underline hover:text-hoverText">
              <img src={Attachment} alt="attachment" />
              ui-icons.png
            </button>
            <span>(4.44 KB)</span>
            <img src={Preview} alt="preview" className="w-4 h-4 object-contain" />
            <p className="text-gray-400">Son (internship) Nguyen Hoang Huu, 07/29/2024 09:41 AM</p>
          </li>
        </ul>
        <button
          onClick={() => setIsAddFile(true)}
          className="flex justify-start text-ocean-blue text-xs text-primaryText hover:underline hover:text-hoverText my-2"
        >
          New file
        </button>
        {isAddFile && <FormAddFile onCancel={() => setIsAddFile(false)} />}
      </div>
      <div className="p-2.5 mt-3 w-3/12 min-h-84">
        <h2 className="text-mouse-gray text-sm">Wiki</h2>
        <ul className="text-ocean-blue text-xs">
          <li className="hover:underline">Start page</li>
          <li className="hover:underline">Index by title</li>
          <li className="hover:underline">Index by date</li>
        </ul>
      </div>
    </div>
  );
};

export default Wiki;
