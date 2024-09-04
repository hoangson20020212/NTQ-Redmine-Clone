import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import IconDelete from "~/assets/images/delete-img.png";
import IconAdd from "~/assets/images/icon-add.png";
import Button from "~/components/Button";

const Files = () => {
  const { name } = useParams();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>{`Files - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="p-2.5 min-h-84 bg-white mt-3 pb-8">
        {openModal ? (
          <>
            <h2 className="text-xl font-semibold pt-0.5 pr-3 mb-3 text-mouse-gray">New file</h2>
            <div className="text-sm bg-light-gray border py-3 mb-2">
              <form>
                <div className="flex py-3 gap-1">
                  <label htmlFor="" className="font-bold text-mouse-gray w-32 text-xs text-right">
                    Version
                  </label>
                  <input type="text" className="border" />
                </div>
                <div className="flex items-center gap-1 pb-3">
                  <label htmlFor="" className="font-bold text-mouse-gray w-32 text-xs text-right">
                    Files
                  </label>
                  <input type="file" className="text-xs" />
                  <span className="pl-6 text-blue-gray text-xs"> (Maximum size: 500 MB)</span>
                </div>
              </form>
            </div>
            <Button>Add</Button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold pt-0.5 pr-3 mb-3 text-mouse-gray">Files</h2>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => setOpenModal(true)}>
                <img src={IconAdd} alt="IconAdd" />
                <span className="link text-xs">New file</span>
              </div>
            </div>

            <table className="table-auto w-full">
              <tr className="font-bold text-sm text-ocean-blue">
                <th className="border">Files</th>
                <th className="border">Date</th>
                <th className="border">Size</th>
                <th className="border">D/L</th>
                <th className="border">MD5</th>
                <th></th>
              </tr>
              <tr className="text-xs">
                <td className="text-ocean-blue text-nowrap">ui-icons.png</td>
                <td className="text-center">07/29/2024 08:34 AM </td>
                <td className="text-center">4.44 KB </td>
                <td className="text-center">3</td>
                <td className="text-center">7a9bc1a997e59f957fe466059ca9b5b6</td>
                <td className="text-center">
                  <img src={IconDelete} alt="IconDelete" className="cursor-pointer" />
                </td>
              </tr>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default Files;
