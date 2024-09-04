import { optionBlockMyPage } from "~/constants/constants";
import { useGlobalStore } from "~/store/globalStore";
import { removeBlockFromBoardSections } from "~/utils/utils";
import CloseImg from "~/assets/images/close-img.png";

const LatestNews = () => {
  const { isEditMyPage, removeBlock } = useGlobalStore((state) => ({
    isEditMyPage: state.isEditMyPage,
    removeBlock: state.removeBlock,
  }));
  const handleClose = () => {
    const blockId = optionBlockMyPage.find((block) => block.title === "Latest news")?.id || "";
    removeBlockFromBoardSections({
      blockId: blockId,
    });
    removeBlock(blockId);
  };
  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-base text-mouse-gray font-bold">Latest News</h2>
      {isEditMyPage && (
        <img className="w-fit h-fit mr-3 cursor-pointer" data-testid="btn-close-latest-news" onClick={handleClose} src={CloseImg} alt="closeButton" />
      )}
    </div>
  );
};

export default LatestNews;
