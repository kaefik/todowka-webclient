# Задача: Обновить типы Notification

## Описание
Обновить интерфейс Notification в src/types/index.ts с правильными полями.

## Файл
`src/types/index.ts`

## Действия
1. Найти или создать интерфейс Notification
2. Добавить все поля согласно документации API
3. Создать type NotificationStatus
4. Убедиться что поля error_message, delivery_method, metadata есть (хотя не отображаются в UI)

## Код
```typescript
export interface Notification {
  id: number;
  task_id?: number;
  message: string;
  status: NotificationStatus;
  scheduled_at?: string;
  sent_at?: string;
  error_message?: string;        // Не отображается в UI
  delivery_method?: string;      // Не отображается в UI
  read: boolean;
  metadata?: Record<string, any>; // Не отображается в UI
  created_at: string;
  updated_at: string;
}

export type NotificationStatus = 'pending' | 'sent' | 'failed';
```

## Проверка
- Interface экспортируется
- Все поля присутствуют
- type NotificationStatus создан
- Опциональные поля помечены как ?

## Оценка
15 минут

## Зависимости
Нет
