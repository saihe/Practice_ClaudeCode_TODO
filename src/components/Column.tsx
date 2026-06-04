'use client';

import { useDroppable } from '@dnd-kit/core';
import type { Card, Status } from '@/types';
import { CardItem } from './Card';
import { AddCardDialog } from './AddCardDialog';

interface ColumnProps {
  column: { id: Status; label: string; color: string };
  cards: Card[];
  onAddCard: (text: string) => void;
  onDeleteCard: (id: string) => void;
  onUpdateCard: (id: string, text: string) => void;
  isDragging: boolean;
}

export function Column({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  isDragging,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex-1 flex flex-col min-w-[260px] max-w-sm rounded-xl border-t-4',
        column.color,
        'bg-gray-100 transition-all duration-150',
        isOver ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset' : '',
        isDragging && !isOver ? 'ring-1 ring-gray-300 ring-inset' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="font-bold text-sm tracking-widest text-gray-600">
          {column.label}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5 font-medium tabular-nums">
          {cards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-3 pb-3 overflow-y-auto min-h-[120px]">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onDelete={() => onDeleteCard(card.id)}
            onUpdate={(text) => onUpdateCard(card.id, text)}
          />
        ))}
      </div>

      <div className="px-3 pb-3">
        <AddCardDialog onAdd={onAddCard} columnLabel={column.label} />
      </div>
    </div>
  );
}
