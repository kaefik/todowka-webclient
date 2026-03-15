'use client';

import { useEffect, type ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl mx-4 sm:mx-6 md:mx-8 max-h-[90vh] overflow-y-auto">
        <Card>
          {title && (
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
            </div>
          )}
          <div className="p-4 sm:p-6">{children}</div>
          {footer && (
            <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-2">
              {footer}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
          >
            ✕
          </button>
        </Card>
      </div>
    </div>
  );
}
