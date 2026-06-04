'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { Card, Status } from '@/types';
import { COLUMNS } from '@/types';
import { Column } from './Column';
import { CardItem } from './Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function Board() {
  const [cards, setCards] = useLocalStorage<Card[]>('kanban-cards', []);
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);

  // Require 8px movement before drag starts — prevents accidental drags on click-to-edit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const card = cards.find((c) => c.id === event.active.id);
      setDraggingCard(card ?? null);
    },
    [cards]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggingCard(null);
      if (!over) return;

      const cardId = active.id as string;
      const targetStatus = over.id as Status;
      if (!COLUMNS.some((col) => col.id === targetStatus)) return;

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, status: targetStatus } : card
        )
      );
    },
    [setCards]
  );

  const addCard = useCallback(
    (text: string, status: Status) => {
      const newCard: Card = {
        id: crypto.randomUUID(),
        text,
        status,
        createdAt: Date.now(),
      };
      setCards((prev) => [...prev, newCard]);
    },
    [setCards]
  );

  const deleteCard = useCallback(
    (id: string) => {
      setCards((prev) => prev.filter((card) => card.id !== id));
    },
    [setCards]
  );

  const updateCard = useCallback(
    (id: string, text: string) => {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, text } : card))
      );
    },
    [setCards]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-2">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.status === col.id)}
            onAddCard={(text) => addCard(text, col.id)}
            onDeleteCard={deleteCard}
            onUpdateCard={updateCard}
            isDragging={!!draggingCard}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingCard && (
          <div className="rotate-2 scale-105 opacity-90 shadow-xl pointer-events-none">
            <CardItem card={draggingCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
