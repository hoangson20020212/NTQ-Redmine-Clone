import { BoardSections, Block } from "~/types/utils.type";

export const initializeBoard = (data: Block[]): BoardSections => {
  return {
    "Board-1": data.slice(0, 3),
    "Board-2": data.slice(3, 6),
    "Board-3": data.slice(6, 9),
    // "Board-1": [],
    // "Board-2": [],
    // "Board-3": [],
  };
};
