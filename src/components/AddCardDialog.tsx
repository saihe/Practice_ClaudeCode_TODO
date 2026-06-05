'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface AddCardDialogProps {
  onAdd: (text: string) => void;
  columnLabel: string;
}

export function AddCardDialog({ onAdd, columnLabel }: AddCardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
    setIsOpen(false);
  };

  const handleClose = () => {
    setText('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors flex items-center gap-1.5"
      >
        <span className="text-base leading-none font-medium">+</span>
        <span>カードを追加</span>
      </button>

      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <DialogTitle className="text-base font-semibold text-gray-900 mb-4">
              {columnLabel} にカードを追加
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                  if (e.key === 'Escape') handleClose();
                }}
                placeholder="カードのテキストを入力..."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  追加
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
