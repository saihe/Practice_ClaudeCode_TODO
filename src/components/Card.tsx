'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Card } from '@/types';

interface CardItemProps {
  card: Card;
  onDelete?: () => void;
  onUpdate?: (text: string) => void;
}

export function CardItem({ card, onDelete, onUpdate }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
      disabled: isEditing,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== card.text) {
      onUpdate?.(trimmed);
    } else {
      setEditText(card.text);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-2">
        <textarea
          autoFocus
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditText(card.text);
              setIsEditing(false);
            }
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitEdit();
            }
          }}
          className="w-full text-sm text-gray-800 resize-none focus:outline-none"
          rows={3}
        />
        <div className="flex justify-end gap-2 mt-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setEditText(card.text);
              setIsEditing(false);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors"
          >
            キャンセル
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={commitEdit}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'bg-white rounded-lg shadow-sm p-3 cursor-grab active:cursor-grabbing group relative',
        isDragging ? 'opacity-30' : 'hover:shadow-md transition-shadow',
      ].join(' ')}
    >
      <p
        className="text-sm text-gray-800 break-words pr-6 select-none"
        onClick={() => setIsEditing(true)}
      >
        {card.text}
      </p>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded text-base leading-none"
          aria-label="カードを削除"
        >
          ×
        </button>
      )}
    </div>
  );
}
