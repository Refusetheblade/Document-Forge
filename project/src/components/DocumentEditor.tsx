import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableComponent } from './DraggableComponent';
import type { DocumentComponent } from '../types';

interface DocumentEditorProps {
  components: DocumentComponent[];
  onComponentsChange: (components: DocumentComponent[]) => void;
}

export function DocumentEditor({ components, onComponentsChange }: DocumentEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over.id);

      onComponentsChange(arrayMove(components, oldIndex, newIndex));
    }
  };

  const handleEdit = (id: string, content: any) => {
    onComponentsChange(
      components.map((component) =>
        component.id === id ? { ...component, content } : component
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={components.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}