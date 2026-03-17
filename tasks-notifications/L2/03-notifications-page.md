# Задача: Создать страницу /notifications

## Описание
Создать страницу для просмотра полного списка всех уведомлений.

## Файлы
- `src/app/notifications/page.tsx` (новый)
- `src/app/notifications/layout.tsx` (новый)

## Действия

### page.tsx
1. Создать page.tsx для notifications
2. Добавить заголовок "Уведомления"
3. Использовать NotificationList компонент
4. Добавить отступы и контейнер

### layout.tsx
1. Создать layout.tsx для notifications
2. Установить фон bg-gray-50

## Код (page.tsx):
```typescript
'use client';

import { NotificationList } from '@/components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Уведомления</h1>
      <NotificationList />
    </div>
  );
}
```

## Код (layout.tsx):
```typescript
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

## Проверка
- Оба файла созданы
- Page экспортируется по умолчанию
- Layout экспортируется по умолчанию
- NotificationList отображается
- Правильные стили

## Оценка
30 минут

## Зависимости
- L2/01-notification-list-component.md
