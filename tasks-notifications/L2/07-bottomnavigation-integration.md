# Задача: Добавить Navigation для уведомлений в BottomNavigation

## Описание
Добавить навигацию по уведомлениям и ConnectionStatus в BottomNavigation компонент.

## Файл
`src/components/layout/BottomNavigation.tsx`

## Действия
1. Импортировать ConnectionStatus компонент
2. Добавить уведомления в массив items
3. Установить badge: unreadCount для уведомлений
4. Добавить ConnectionStatus компонент (fixed bottom-16)
5. Обернуть в fixed positioning

## Код (добавить в BottomNavigation.tsx):
```typescript
import { ConnectionStatus } from './ConnectionStatus';

// В массив items добавить:
{
  path: '/notifications',
  label: 'Уведомления',
  icon: '🔔',
  badge: unreadCount
}

// Добавить ConnectionStatus (в компонент после BottomNavigation):
<div className="fixed bottom-16 left-0 right-0 p-2">
  <ConnectionStatus />
</div>
```

## Проверка
- ConnectionStatus импортирован
- Уведомления добавлены в items
- Badge работает
- ConnectionStatus фиксирован

## Оценка
1 час

## Зависимости
- L1/07-connection-status-component.md
