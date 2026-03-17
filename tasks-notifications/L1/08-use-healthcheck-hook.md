# Задача: Создать useHealthCheck hook

## Описание
Создать hook для периодической проверки здоровья системы уведомлений.

## Файл
`src/lib/hooks/useHealthCheck.ts` (новый)

## Действия
1. Создать интерфейс HealthStatus с полями: status, sse, celery, redis, active_connections, timestamp
2. Создать useHealthCheck(interval) hook
3. Реализовать checkHealth() функцию
4. Запрос к GET /api/v1/health/notifications
5. Обработка ошибок
6. Периодический вызов через setInterval
7. Вернуть { health, isLoading, refreshHealth }

## Код
```typescript
import { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  sse: 'available' | 'unavailable';
  celery: 'running' | 'stopped';
  redis: 'running' | 'stopped';
  active_connections?: number;
  timestamp: string;
}

export function useHealthCheck(interval: number = 5 * 60 * 1000) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/health/notifications`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('[HealthCheck] Error:', error);
      setHealth({
        status: 'offline',
        sse: 'unavailable',
        celery: 'stopped',
        redis: 'stopped',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const intervalId = setInterval(checkHealth, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return { health, isLoading, refreshHealth: checkHealth };
}
```

## Проверка
- Hook экспортируется
- Интерфейс HealthStatus правильный
- active_connections опциональный
- checkHealth обрабатывает ошибки
- Интервал работает
- Cleanup функция корректная

## Оценка
1 час

## Зависимости
Нет
