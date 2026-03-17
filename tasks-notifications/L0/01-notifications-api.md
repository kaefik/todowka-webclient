# Задача: Дополнить notificationsAPI

## Описание
Добавить недостающие методы в notificationsAPI для работы с уведомлениями.

## Файл
`src/lib/api/notifications.ts`

## Действия
1. Добавить метод `getAll()` для получения всех уведомлений
2. Добавить метод `getUnread()` для получения непрочитанных уведомлений
3. Добавить метод `markAsRead(id)` для отметки уведомления как прочитанного
4. Добавить метод `markAllAsRead()` для отметки всех уведомлений как прочитанных
5. Сохранить существующие методы: `getById()`, `update()`, `delete()`

## Код
```typescript
export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications');
  },

  async getUnread(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications/unread');
  },

  async markAsRead(id: number): Promise<void> {
    return api.post(`/notifications/${id}/read`, {});
  },

  async markAllAsRead(): Promise<void> {
    return api.post('/notifications/read-all', {});
  },

  // Существующие методы
  async getById(id: number): Promise<Notification> {
    return api.get<Notification>(`/notifications/${id}`);
  },

  async update(id: number, data: any): Promise<Notification> {
    return api.put<Notification>(`/notifications/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/notifications/${id}`);
  }
};
```

## Проверка
- Все методы экспортируются
- Правильные типы возвращаемых значений
- Правильные URL endpoints

## Оценка
15 минут

## Зависимости
Нет
