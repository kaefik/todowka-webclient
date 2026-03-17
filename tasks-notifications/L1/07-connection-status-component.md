# Задача: Создать ConnectionStatus компонент

## Описание
Создать компонент для отображения online/offline статуса подключения.

## Файл
`src/components/layout/ConnectionStatus.tsx` (новый)

## Действия
1. Создать ConnectionStatus компонент
2. Использовать useState для isOnline
3. Использовать navigator.onLine для начального статуса
4. Добавить event listeners: online, offline
5. Очистить listeners в cleanup
6. Показать красный индикатор только когда offline

## Код
```typescript
'use client';

import { useState, useEffect } from 'react';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-red-700">Offline</span>
    </div>
  );
}
```

## Проверка
- Компонент экспортируется
- isOnline обновляется при событиях
- Индикатор только когда offline
- Cleanup функции корректные

## Оценка
30 минут

## Зависимости
Нет
