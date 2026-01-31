"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import BoardList from "../BoardList";
import { ListT } from "@/types/list";

export default function SortableBoardList({ list }: { list: ListT }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BoardList list={list} dragHandleListeners={listeners} />
    </div>
  );
}
