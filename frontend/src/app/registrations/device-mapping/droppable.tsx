import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { Props } from '@dnd-kit/core/dist/components/DndContext/DndContext';

export function Droppable(props:Props) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id ?? "",
      });
  
  return (
    <div ref={setNodeRef} className={`w-full h-min ${isOver?"bounce": ""}`}>
      {props.children}
    </div>
  );
}