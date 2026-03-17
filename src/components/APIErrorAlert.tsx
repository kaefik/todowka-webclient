'use client';

import { useEffect } from 'react';
import { useAPIErrorStore } from '@/stores/useAPIErrorStore';
import { Button } from './ui/Button';

export function APIErrorAlert() {
  const { errors, removeError } = useAPIErrorStore();

  if (errors.length === 0) {
    return null;
  }

  const getErrorMessage = (error: { message: string; status: number }) => {
    if (error.status === 0) {
      return 'Сервис недоступен. Проверьте подключение к интернету.';
    }
    if (error.status >= 500) {
      return 'Ошибка сервера. Попробуйте позже.';
    }
    if (error.status >= 400) {
      return error.message || 'Ошибка запроса.';
    }
    return error.message || 'Неизвестная ошибка.';
  };

  const getErrorIcon = (status: number) => {
    if (status === 0) return '🔌';
    if (status >= 500) return '🔴';
    if (status >= 400) return '⚠️';
    return '❌';
  };

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[70] space-y-2">
      {errors.map((error) => (
        <div
          key={error.id}
          className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getErrorIcon(error.status)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                {getErrorMessage(error)}
              </p>
              {error.status > 0 && (
                <p className="text-xs text-red-700 mt-1">
                  Код ошибки: {error.status}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => removeError(error.id)}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
