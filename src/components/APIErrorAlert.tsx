'use client';

import { useEffect } from 'react';
import { useAPIErrorStore } from '@/stores/useAPIErrorStore';
import { Button } from './ui/Button';

export function APIErrorAlert() {
  const { errors, removeError } = useAPIErrorStore();

  if (errors.length === 0) {
    return null;
  }

  const parseErrors = (message: string): string[] => {
    if (!message) return ['Неизвестная ошибка'];
    return message.split('; ').filter(Boolean);
  };

  const getErrorIcon = (status: number) => {
    if (status === 0) return '🔌';
    if (status >= 500) return '🔴';
    if (status >= 400) return '⚠️';
    return '❌';
  };

  const getErrorTitle = (status: number) => {
    if (status === 0) return 'Сервис недоступен';
    if (status >= 500) return 'Ошибка сервера';
    if (status === 422) return 'Ошибка валидации';
    if (status >= 400) return 'Ошибка запроса';
    return 'Ошибка';
  };

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[70] space-y-2">
      {errors.map((error) => {
        const errorMessages = parseErrors(error.message);
        return (
          <div
            key={error.id}
            className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{getErrorIcon(error.status)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900 mb-1">
                  {getErrorTitle(error.status)}
                </p>
                <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                  {errorMessages.map((msg, idx) => (
                    <li key={idx} className="break-words">
                      {msg}
                    </li>
                  ))}
                </ul>
                {error.status > 0 && error.status !== 422 && (
                  <p className="text-xs text-red-600 mt-2">
                    Код: {error.status}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => removeError(error.id)}
                className="text-red-700 hover:text-red-900 flex-shrink-0"
              >
                ✕
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
