# Задача: Добавить NotificationCenter в Header

## Описание
Интегрировать NotificationCenter dropdown в Header компонент для быстрого доступа к уведомлениям.

## Файл
`src/components/layout/Header.tsx`

## Действия
1. Импортировать NotificationCenter компонент
2. Добавить NotificationCenter в правую часть Header (ml-auto)
3. Убедиться что он отображается только на desktop (hidden sm:flex в Header)

## Код (обновить Header.tsx):
```typescript
'use client';

import { useNavigationStore } from '@/stores/useNavigationStore';
import { Button } from '@/components/ui/Button';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useNavigationStore();

  return (
    <header className="hidden sm:flex bg-white border-b border-border px-4 py-3 items-center gap-4">
      <Button type="button" variant="ghost" size="sm" onClick={toggleSidebar}>
        ☰
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto">
        <NotificationCenter />
      </div>
    </header>
  );
}
```

## Проверка
- NotificationCenter импортирован
- Добавлен в ml-auto div
- Отображается на desktop (sm: breakpoint)

## Оценка
30 минут

## Зависимости
- L2/02-notification-center-dropdown.md
