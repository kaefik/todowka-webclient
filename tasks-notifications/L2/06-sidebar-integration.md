# Задача: Добавить Navigation для уведомлений в Sidebar

## Описание
Добавить навигацию по уведомлениям и настройкам в Sidebar компонент.

## Файл
`src/components/layout/Sidebar.tsx`

## Действия
1. Импортировать useUnreadNotifications hook
2. Импортировать ConnectionStatus компонент
3. Получить unreadCount из useUnreadNotifications
4. Добавить ссылку на /notifications с badge
5. Добавить ссылку на /settings внизу Sidebar
6. Добавить ConnectionStatus внизу Sidebar
7. Обернуть в mt-auto pt-4 border-t

## Код (добавить в Sidebar.tsx):
```typescript
import { useUnreadNotifications } from '@/lib/hooks/useNotifications';
import { ConnectionStatus } from './ConnectionStatus';

// Внутри компонента Sidebar добавить:
const { data: unreadNotifications } = useUnreadNotifications();
const unreadCount = unreadNotifications?.length || 0;

// В секцию навигации добавить:
<a
  href="/notifications"
  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
>
  <span className="text-xl">🔔</span>
  <span>Уведомления</span>
  {unreadCount > 0 && (
    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
      {unreadCount}
    </span>
  )}
</a>

// Внизу sidebar добавить (в mt-auto секцию):
<div className="mt-auto pt-4 border-t">
  <ConnectionStatus />
  <a
    href="/settings"
    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-xl">⚙️</span>
    <span>Настройки</span>
  </a>
</div>
```

## Проверка
- useUnreadNotifications импортирован
- ConnectionStatus импортирован
- Ссылка на /notifications с badge
- Ссылка на /settings
- ConnectionStatus внизу

## Оценка
1 час

## Зависимости
- L0/03-use-unread-notifications-hook.md
- L1/07-connection-status-component.md
