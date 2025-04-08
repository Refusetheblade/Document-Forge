import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DocumentComponent } from '../types';

interface DraggableComponentProps {
  component: DocumentComponent;
  onEdit: (id: string, content: any) => void;
}

export function DraggableComponent({ component, onEdit }: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <input
            type="text"
            value={component.content}
            onChange={(e) => onEdit(component.id, e.target.value)}
            className="text-2xl font-bold w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          />
        );
      case 'text':
        return (
          <textarea
            value={component.content}
            onChange={(e) => onEdit(component.id, e.target.value)}
            className="w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          />
        );
      case 'image':
        return (
          <div className="relative">
            <img src={component.content} alt="" className="max-w-full h-auto" />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => onEdit(component.id, reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move"
    >
      {renderComponent()}
    </div>
  );
}