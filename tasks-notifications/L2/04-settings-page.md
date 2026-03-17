# Задача: Создать страницу /settings с Health Status

## Описание
Создать страницу настроек с отображением состояния системы уведомлений.

## Файлы
- `src/app/settings/page.tsx` (новый)
- `src/app/settings/layout.tsx` (новый)

## Действия

### page.tsx
1. Создать page.tsx для settings
2. Использовать useHealthCheck hook
3. Отобразить Health Status компонент
4. Показать статусы: overall, SSE, Celery, Redis
5. Показать active_connections
6. Добавить кнопку "Обновить"
7. Показать timestamp последней проверки

### layout.tsx
1. Создать layout.tsx для settings
2. Установить фон bg-gray-50

## Код (page.tsx):
```typescript
'use client';

import { useHealthCheck } from '@/lib/hooks/useHealthCheck';

export default function SettingsPage() {
  const { health, isLoading, refreshHealth } = useHealthCheck();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Состояние системы</h2>
          <button
            onClick={refreshHealth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Обновить
          </button>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Загрузка...
          </div>
        ) : health ? (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Общий статус</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">SSE (Real-time)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.sse === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.sse === 'available' ? '🟢 Доступен' : '🔴 Недоступен'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Celery (Background tasks)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.celery === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.celery === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Redis (Pub/Sub)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.redis === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.redis === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
              </span>
            </div>

            {health.active_connections !== undefined && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Активные SSE подключения</span>
                <span className="text-gray-600">{health.active_connections} / 100</span>
              </div>
            )}

            <div className="text-xs text-gray-400 pt-2 border-t">
              Последняя проверка: {new Date(health.timestamp).toLocaleString('ru-RU')}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-red-500">
            Не удалось получить статус системы
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Настройки уведомлений</h2>
        <p className="text-gray-500">В будущих версиях здесь будут настройки уведомлений</p>
      </div>
    </div>
  );
}
```

## Код (layout.tsx):
```typescript
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

## Проверка
- Оба файла созданы
- useHealthCheck используется
- Все статусы отображаются
- active_connections показывается
- Кнопка "Обновить" работает
- Timestamp корректный

## Оценка
2 часа

## Зависимости
- L1/08-use-healthcheck-hook.md
