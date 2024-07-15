import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import { Props } from '@dnd-kit/core/dist/components/DndContext/DndContext';

export function Draggable(props:any) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id ?? "",
    data: props.data
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div {...listeners} style={style} {...attributes} ref={setNodeRef}>
        {props.children}
    </div>
  );
}