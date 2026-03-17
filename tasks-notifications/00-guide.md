# Tasks-notifications - Руководство по выполнению

## Структура задач

Задачи разбиты на 3 уровня сложности по зависимостям:

### L0 (Базовый уровень) - 5 задач
Простейшие задачи без сложных зависимостей, выполняются первыми:
1. Дополнить notificationsAPI (15 мин)
2. Создать useNotifications hook (30 мин)
3. Создать useUnreadNotifications hook (15 мин)
4. Создать useTaskNotifications hook (15 мин)
5. Обновить типы Notification (15 мин)

**Всего:** ~1.5 часа

### L1 (Средний уровень) - 10 задач
Задачи средней сложности, зависят от L0:
1. Создать базовую структуру NotificationStream (30 мин)
2. Реализовать SSE connection (45 мин)
3. Реализовать helper методы (30 мин)
4. Реализовать polling fallback (45 мин)
5. Реализовать reconnection logic (30 мин)
6. Создать NotificationItem компонент (1 час)
7. Создать ConnectionStatus компонент (30 мин)
8. Создать useHealthCheck hook (1 час)
9. Упростить NotificationManager (30 мин)

**Всего:** ~5.5 часов

### L2 (Сложный уровень) - 7 задач
Задачи интеграции, зависят от L0 и L1:
1. Создать NotificationList компонент (1.5 часа)
2. Создать NotificationCenter dropdown (1.5 часа)
3. Создать страницу /notifications (30 мин)
4. Создать страницу /settings (2 часа)
5. Добавить NotificationCenter в Header (30 мин)
6. Добавить Navigation в Sidebar (1 час)
7. Добавить Navigation в BottomNavigation (1 час)

**Всего:** ~7.5 часов

### L3 (Тестирование и документация) - 4 задачи
Задачи качества кода, зависят от L2:
1. Тесты для NotificationItem (1.5 часа)
2. Тесты для NotificationList (1.5 часа)
3. Тесты для NotificationStream (2.5 часа)
4. Обновить README (45 мин)

**Всего:** ~5.5 часов

## Общее время

**Всего:** ~20 часов разработки

## Порядок выполнения

### Начало работы
1. Прочитать план: `docs/plans/2026-03-17-notifications-webclient-v2.1.md`
2. Начать с задач L0 в любом порядке
3. После завершения L0 переходить к L1 по порядку (1→2→3→4→5)

### NotificationStream задачи (L1/01-05)
Эти задачи должны выполняться строго по порядку:
1. L1/01-notificationstream-structure.md
2. L1/02-notificationstream-sse-connection.md
3. L1/03-notificationstream-helpers.md
4. L1/04-notificationstream-polling-fallback.md
5. L1/05-notificationstream-reconnection.md

### Компоненты (L1/06-09, L2)
Зависимости:
- L2/01 зависит от L0/02 и L1/06
- L2/02 зависит от L0/03 и L2/01
- L2/03 зависит от L2/01
- L2/04 зависит от L1/08
- L2/05 зависит от L2/02
- L2/06 зависит от L0/03 и L1/07
- L2/07 зависит от L1/07

### Тестирование (L3)
Выполнять после завершения всех задач L2.

## Отметка выполненных задач

После завершения каждой задачи:
1. Проверить все пункты из секции "Проверка"
2. Запустить `npm run typecheck` для проверки типов
3. Запустить `npm run lint` для проверки стиля кода
4. Отметить задачу как выполненную (добавить ✅ в заголовок или переименовать)

## Важные замечания

### Типы таймеров
Во всех файлах использовать `ReturnType<typeof setTimeout>` вместо `NodeJS.Timeout` для совместимости с браузерным кодом.

### Polling
- По умолчанию `refetchInterval: false` (без polling)
- Polling включается только через NotificationStream при SSE недоступности
- Никаких интервалов в компонентах кроме через React Query

### SSE connection
- SSE отправляет полные уведомления
- При получении сообщения → invalidate React Query cache
- UI обновляется автоматически через React Query

### NotificationManager
- Убран весь polling задач
- Только инициализация SSE и browser notifications
- Console.log только в development режиме

### Тесты
- EventSource mock в тестах (не вызывать несуществующие методы)
- Mock useNotifications для компонентных тестов

## Проверка качества

После завершения всех задач:
1. Запустить `npm run typecheck`
2. Запустить `npm run lint`
3. Запустить `npm run build` (если есть тесты, запустить сначала их)
4. Проверить все страницы вручную:
   - /notifications
   - /settings
   - NotificationCenter dropdown
   - Badge счетчики
   - Online/offline индикатор

## Результат

После выполнения всех 26 задач будет реализована полная система уведомлений с:
- SSE primary + polling fallback
- Real-time обновления через React Query cache invalidation
- Browser notifications
- Центр уведомлений
- Health monitoring
- Полным покрытием тестами
- Документацией в README
