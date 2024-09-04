import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BoardSections, Block } from "~/types/utils.type";

type State = {
  activeItemId: number;
  isEditMyPage: boolean;
  boardSections: BoardSections;
  isSuccessEdit: boolean;
};

type Actions = {
  setActiveItemId: (data: number) => void;
  setIsEditMyPage: (data: boolean) => void;
  setIsSuccessEdit: (data: boolean) => void;
  setBoardSections: (data: BoardSections) => void;
  removeBlock: (blockId: string) => void;
  addBlockToBoardSections: ({ boardId, block }: { boardId: string; block: Block }) => void;
};

export const useGlobalStore = create<State & Actions>()(
  immer((set) => ({
    activeItemId: 1,
    setActiveItemId: (data) => {
      set((state) => {
        state.activeItemId = data;
      });
    },
    isEditMyPage: false,
    setIsEditMyPage: (data) => {
      set((state) => {
        state.isEditMyPage = data;
      });
    },
    isSuccessEdit: false,
    setIsSuccessEdit: (data) => {
      set((state) => {
        state.isSuccessEdit = data;
      });
    },
    boardSections: {},
    setBoardSections: (boardSections) => {
      set((state) => {
        state.boardSections = boardSections;
      });
    },
    removeBlock: (blockId) => {
      set((state) => {
        Object.keys(state.boardSections).forEach((boardId) => {
          state.boardSections[boardId] = state.boardSections[boardId].filter((block) => block.id !== blockId);
        });
      });
    },
    addBlockToBoardSections: ({ boardId, block }: { boardId: string; block: Block }) => {
      set((state) => {
        state.boardSections[boardId] = [block, ...state.boardSections[boardId]];
      });
    },
  })),
);
