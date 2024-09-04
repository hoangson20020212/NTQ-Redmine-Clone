import { useState } from "react";
import { Helmet } from "react-helmet-async";
import IconAdd from "~/assets/images/icon-add.png";
import IconBack from "~/assets/images/icon-back.png";
import BoardSectionList from "~/components/BoardSectionList";
import { optionBlockMyPage } from "~/constants/constants";
import useScrollToTop from "~/hooks/useScrollToTop";
import { useGlobalStore } from "~/store/globalStore";
import { Block } from "~/types/utils.type";

const MyPage = () => {
  useScrollToTop();
  const { isEditMyPage, setIsEditMyPage, addBlockToBoardSections, boardSections } = useGlobalStore((state) => state);

  const [blockSelect, setBlockSelect] = useState<Block | undefined>();

  const selectedIds = new Set<string>();

  if (boardSections) {
    Object.values(boardSections).forEach((board: Block[]) => {
      board.forEach((block) => {
        selectedIds.add(block.id);
      });
    });
  }

  const unselectedBlocks = optionBlockMyPage.filter((block) => !selectedIds.has(block.id));

  const handleAddBlock = (block: Block | undefined) => {
    if (block) {
      setBlockSelect(undefined);
      addBlockToBoardSections({
        block,
        boardId: "Board-1",
      });
    }
  };

  const handleShowOptionSelected = () => {
    setIsEditMyPage(true);
  };

  const handleClosePersonalize = () => {
    setIsEditMyPage(false);
  };

  const handleSelectBlock = (value: string) => {
    if (value === "") return;
    setBlockSelect({
      id: unselectedBlocks.find((item) => item.title === value)?.id || Math.random().toString(),
      title: value,
    });
  };

  return (
    <>
      <Helmet>
        <title>My page - NTQ Redmine</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <div className="pt-1 flex items-center bg-white justify-between">
        <h2 className="text-xl font-bold pt-0.5 pr-3 mb-3 text-mouse-gray ">My page</h2>
        {isEditMyPage ? (
          <div className="text-xs text-mouse-gray flex items-center">
            {unselectedBlocks.length > 0 && (
              <>
                <label htmlFor="blockSelect">My page block:</label>
                <select
                  id="blockSelect"
                  data-testid="blockSelect"
                  className="border border-solid py-1 ml-1"
                  value={blockSelect?.title || ""}
                  onChange={(e) => handleSelectBlock(e.target.value)}
                >
                  <option value=""></option>
                  {unselectedBlocks.map((item) => (
                    <option value={item.title} key={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <button className="text-ocean-blue ml-2 hover:underline flex" onClick={() => handleAddBlock(blockSelect)}>
                  <img className="mr-1" src={IconAdd} alt="Add" />
                  Add
                </button>
              </>
            )}
            <button className="text-ocean-blue ml-2 hover:underline flex" onClick={handleClosePersonalize}>
              <img className="mr-1" src={IconBack} alt="Back" />
              Back
            </button>
          </div>
        ) : (
          <p className="text-ocean-blue text-xs cursor-pointer leading-6 hover:underline" onClick={handleShowOptionSelected}>
            Personalize this page
          </p>
        )}
      </div>

      <BoardSectionList isDragDropEnabled={isEditMyPage} />
    </>
  );
};

export default MyPage;
