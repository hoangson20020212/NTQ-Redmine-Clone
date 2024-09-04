import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Block } from "~/types/utils.type";
import BlockItem from "./BlockItem";
import { cn } from "~/utils/utils";
import { useGlobalStore } from "~/store/globalStore";

interface BoardProps {
  boardId: string;
  blocks: Block[];
}

const Board: React.FC<BoardProps> = ({ boardId, blocks }) => {
  const { isEditMyPage } = useGlobalStore((state) => ({
    isEditMyPage: state.isEditMyPage,
  }));

  const renderBlocks = () => {
    return blocks.map((block, index) => (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <BlockItem block={block} />
          </div>
        )}
      </Draggable>
    ));
  };

  return (
    <Droppable droppableId={boardId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn("w-full flex flex-col gap-4 py-2 min-h-8", { "border-dashed border border-gray-400": isEditMyPage })}
        >
          {renderBlocks()}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Board;
