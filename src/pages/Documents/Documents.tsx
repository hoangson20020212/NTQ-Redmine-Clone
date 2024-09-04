import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const OPTION_SORT = [
  { id: 1, title: "Category" },
  { id: 2, title: "Date" },
  { id: 3, title: "Title" },
  { id: 4, title: "Author" },
];

const Documents = () => {
  const { name } = useParams();
  const [documentList] = useState([]);
  const [active, setActive] = useState(1);

  return (
    <div className="flex ">
      <Helmet>
        <title>{`Documents - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="min-h-84 flex flex-col gap-2.5 bg-white w-9/12 px-3 mt-3 pb-8 border border-solid ">
        <h2 className="text-mouse-gray mt-2">Documents</h2>
        {documentList.length ? (
          documentList.map((document) => <div> {document}</div>)
        ) : (
          <p className="text-10 text-center bg-orange-100 text-yellow-600 border-2 border-solid border-yellow-500 p-1">No data to display</p>
        )}
      </div>
      <div className="px-5 mt-6">
        <h3 className="text-sm my-2.5 text-gray-600">Sort by</h3>
        <div className="flex flex-col items-start gap-0.5">
          {OPTION_SORT.map((item) => (
            <button
              onClick={() => setActive(item.id)}
              key={item.id}
              className={`text-xs hover:underline ${item.id === active && "bg-blue-200 text-white "} rounded-sm p-0.5 `}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
