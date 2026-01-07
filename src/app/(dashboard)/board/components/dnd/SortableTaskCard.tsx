"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import TaskCard from "../TaskCard";
import { CardT } from "@/types/card";

type Props = {
  card: CardT;
  projectTitle: string;
};

export default function SortableTaskCard({ card, projectTitle }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard props={card} projectTitle={projectTitle} />
    </div>
  );
}
