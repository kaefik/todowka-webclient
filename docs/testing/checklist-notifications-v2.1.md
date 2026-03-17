# Чеклист тестирования уведомлений - ToDowka Web Client v2.1

## 📋 Описание

Чеклист для проверки функциональности системы уведомлений, реализованной по плану от 2026-03-17.

---

## 🧪 ЧАСТЬ 1: РУЧНОЕ ТЕСТИРОВАНИЕ (Manual Testing)

### ✅ SSE Connection (Server-Sent Events)

#### Подготовка
- [ ] Убедитесь, что API сервер запущен (`NEXT_PUBLIC_API_URL` настроен)
- [ ] Откройте DevTools → Network tab
- [ ] Откройте DevTools → Console tab

#### Тесты
- [ ] **SSE устанавливается при загрузке страницы**
  - Откройте приложение
  - В Network tab найдите запрос к `/api/v1/notifications/stream`
  - Проверьте, что тип запроса `eventsource`
  - Проверьте статус соединения (должен быть `pending` или `200`)

- [ ] **SSE показывает сообщения в реальном времени**
  - Создайте задачу с напоминанием через API или через UI
  - Дождитесь времени напоминания
  - Проверьте Console на наличие логов `[NotificationStream] Connected via SSE`
  - Проверьте, что уведомление появляется мгновенно (без перезагрузки)

- [ ] **SSE таймаут (30 сек) переключается на polling**
  - В Network tab блокируйте запрос `/api/v1/notifications/stream`
  - Подождите 30 секунд
  - В Console должен быть лог: `[NotificationStream] Connection timeout after 30s, switching to polling`
  - Проверьте, что начинаются периодические запросы `GET /api/v1/notifications` каждые 30 сек

- [ ] **SSE ошибка переключается на polling**
  - Разорвите интернет соединение
  - В Console должен быть лог: `[NotificationStream] SSE error:`
  - Проверьте, что переключение на polling произошло
  - Проверьте, что браузер показывает уведомление "Режим реального времени недоступен"

---

### ✅ Polling Fallback

#### Тесты
- [ ] **Polling работает каждые 30 секунд**
  - Откройте DevTools → Network tab
  - Вызовите SSE timeout или ошибку (как выше)
  - Наблюдайте за запросами `GET /api/v1/notifications`
  - Подтвердите интервал ~30 сек между запросами

- [ ] **Polling уведомление через 5 минут**
  - Установите polling режим (через SSE timeout или отключение сети)
  - Подождите 5 минут
  - Должно появиться browser notification: "Уведомление: Режим реального времени недоступен"

- [ ] **SSE переподключается каждые 60 сек**
  - Включите polling режим
  - Подождите 60 секунд
  - В Console: `[NotificationStream] Attempting to reconnect SSE...`
  - Если сеть доступна - SSE должен восстановиться
  - В Console: `[NotificationStream] Connected via SSE`
  - Polling должен остановиться (проверьте Network tab)

---

### ✅ NotificationCenter Component

#### Подготовка
- [ ] Откройте приложение на рабочем столе (Desktop view)

#### Тесты
- [ ] **Отображается иконка уведомления в Header**
  - В Header (справа) должна быть иконка 🔔
  - Если есть непрочитанные - badge с числом

- [ ] **Badge показывает количество непрочитанных**
  - Создайте 2 непрочитанных уведомления
  - Badge должен показывать "2"
  - Создайте еще 5 - должен показать "9+" (если больше 9)

- [ ] **Dropdown открывается при клике**
  - Нажмите на иконку 🔔
  - Должен открыться dropdown справа от иконки
  - Ширина dropdown ~384px (w-96)
  - Максимальная высота ~384px (max-h-96) с прокруткой

- [ ] **Dropdown показывает последние 5 уведомлений**
  - Создайте 7 уведомлений
  - В dropdown должны быть только последние 5
  - Ссылка "Все уведомления →" в нижней части dropdown

- [ ] **Dropdown закрывается при клике вне**
  - Откройте dropdown
  - Нажмите в любом месте вне dropdown
  - Dropdown должен закрыться

- [ ] **Ссылка "Все уведомления" ведет на /notifications**
  - Нажмите на "Все уведомления →"
  - Должен произойти переход на `/notifications`
  - Dropdown должен закрыться

---

### ✅ NotificationList Component

#### Подготовка
- [ ] Перейдите на страницу `/notifications`

#### Тесты
- [ ] **Загрузка уведомлений**
  - Показывается текст "Загрузка..." пока данные не получены
  - После загрузки показываются уведомления

- [ ] **Нет уведомлений**
  - Удалите все уведомления (или очистите базу)
  - Должно показаться: emoji 🔔 + текст "Нет уведомлений"

- [ ] **Список уведомлений**
  - Каждое уведомление в отдельной строке
  - Показывается: сообщение, статус, дата создания
  - Если есть task_id - показывается "Задача #X"
  - Цвет строки: синий фон если не прочитано (bg-blue-50), белый если прочитано

- [ ] **Кнопка "Отметить"**
  - Для непрочитанных есть кнопка "Отметить"
  - При клике - уведомление отмечается как прочитанное
  - Строка меняет цвет на белый
  - Кнопка исчезает

- [ ] **Кнопка "Отметить все как прочитанные"**
  - Если есть непрочитанные - кнопка видна в заголовке
  - Badge показывает количество непрочитанных
  - При клике - все уведомления становятся прочитанными
  - Badge исчезает

- [ ] **Ограничение количества (limit prop)**
  - Компонент должен поддерживать `limit` проп
  - Если limit=5 - показываются только первые 5
  - Если общее количество больше limit - показывается ссылка "Показать все (X)"

---

### ✅ NotificationItem Component

#### Тесты
- [ ] **Отображение сообщения**
  - Текст уведомления отображается полностью

- [ ] **Отображение статуса**
  - `pending` - желтый бейдж (bg-yellow-100)
  - `sent` - зеленый бейдж (bg-green-100)
  - `failed` - красный бейдж (bg-red-100)

- [ ] **Форматирование даты**
  - Дата в формате DD.MM.YYYY HH:mm
  - Локаль: ru-RU

- [ ] **Скрытые поля**
  - `error_message` - НЕ отображается в UI
  - `metadata` - НЕ отображается в UI
  - `delivery_method` - НЕ отображается в UI

- [ ] **Hover эффект**
  - При наведении мыши - фон меняется на серый (hover:bg-gray-50)

---

### ✅ Страница /notifications

#### Тесты
- [ ] **URL**
  - Перейдите на `/notifications`
  - Заголовок: "Уведомления"
  - Layout: gray-50 фон

- [ ] **Контейнер**
  - Ширина: max-w-4xl
  - Отступы: px-4 py-8
  - Центрирование: mx-auto

- [ ] **Интеграция с NotificationList**
  - Компонент NotificationList отображается корректно
  - Все функции списка работают

---

### ✅ Browser Notifications

#### Подготовка
- [ ] Откройте Chrome/Firefox
- [ ] Разрешите браузерные уведомления (если спрашивает)

#### Тесты
- [ ] **Запрос разрешения**
  - При первом уведомлении браузер должен спросить разрешение
  - Разрешите уведомления

- [ ] **Показ уведомления**
  - Дождитесь нового уведомления через SSE
  - Должно появиться браузерное уведомление
  - Заголовок: "Task Reminder"
  - Тело: сообщение уведомления
  - Тег: `notification-{id}`

- [ ] **Отмена разрешения**
  - Отзовите разрешение уведомлений в браузере
  - Новые уведомления НЕ должны появляться как браузерные
  - Они должны появляться только в UI

---

### ✅ Online/Offline Indicator

#### Тесты
- [ ] **Online статус**
  - При подключении к интернету - индикатор НЕ показывается

- [ ] **Offline статус**
  - Отключите интернет (Chrome DevTools → Network → Offline)
  - В Sidebar или BottomNavigation должен появиться индикатор:
    - Красная точка с анимацией (animate-pulse)
    - Текст "Offline"
    - Красный фон (bg-red-50)

- [ ] **Автоматическое определение**
  - При подключении - индикатор исчезает
  - При отключении - индикатор появляется
  - Без перезагрузки страницы

---

### ✅ Health Check (Страница /settings)

#### Подготовка
- [ ] Перейдите на `/settings`

#### Тесты
- [ ] **Отображение статуса системы**
  - Заголовок: "Состояние системы"
  - Кнопка: "Обновить"

- [ ] **Статусы сервисов**
  - **Общий статус**: healthy/degraded/offline с цветом бейджа
  - **SSE**: Доступен (🟢) или Недоступен (🔴)
  - **Celery**: Работает (🟢) или Остановлен (🔴)
  - **Redis**: Работает (🟢) или Остановлен (🔴)
  - **Активные SSE подключения**: число / 100

- [ ] **Обновление статуса**
  - Нажмите "Обновить"
  - Статус должен перезагрузиться
  - Время последней проверки обновляется

- [ ] **Ошибка загрузки**
  - Отключите API сервер
  - Обновите страницу
  - Должно показать: "Не удалось получить статус системы"

---

### ✅ Navigation Integration

#### Sidebar (Desktop)
- [ ] **Пункт "Уведомления"**
  - В меню есть пункт с иконкой 🔔
  - Текст: "Уведомления"
  - Ссылка на `/notifications`
  - Badge справа с количеством непрочитанных

- [ ] **Пункт "Настройки"**
  - Внизу Sidebar есть пункт с иконкой ⚙️
  - Текст: "Настройки"
  - Ссылка на `/settings`

- [ ] **ConnectionStatus**
  - Внизу Sidebar (выше Настроек) отображается ConnectionStatus

#### BottomNavigation (Mobile)
- [ ] **Иконка уведомлений**
  - В нижней навигации есть иконка 🔔
  - При непрочитанных - badge над иконкой
  - Нажатие ведет на `/notifications`

- [ ] **ConnectionStatus**
  - Fixed позиция над BottomNavigation (bottom-16)
  - Показывается только при offline

---

### ✅ React Query Cache Invalidation

#### Тесты
- [ ] **SSE сообщение обновляет UI**
  - Откройте страницу уведомлений
  - Создайте новое уведомление (через API)
  - UI должен обновиться мгновенно (без перезагрузки)
  - Новое уведомление должно появиться в списке

- [ ] **Mark as read обновляет список**
  - Откройте страницу уведомлений
  - Нажмите "Отметить" на уведомлении
  - Уведомление меняет цвет на белый
  - Badge обновляется (если был > 0)

- [ ] **Mark all as read обновляет всё**
  - Откройте страницу с несколькими непрочитанными
  - Нажмите "Отметить все как прочитанные"
  - Все уведомления меняют цвет на белый
  - Badge исчезает
  - Кнопка "Отметить все как прочитанные" исчезает

---

### ✅ Cross-Browser Testing

#### Тесты в разных браузерах
- [ ] **Chrome (latest)**
  - Все функции работают
  - SSE соединение устанавливается
  - Browser notifications работают

- [ ] **Firefox (latest)**
  - Все функции работают
  - SSE соединение устанавливается
  - Browser notifications работают

- [ ] **Safari (если доступен)**
  - Все функции работают
  - SSE соединение устанавливается
  - Browser notifications работают

- [ ] **Edge (если доступен)**
  - Все функции работают
  - SSE соединение устанавливается
  - Browser notifications работают

---

### ✅ Responsive Design

#### Mobile View (< 640px)
- [ ] **BottomNavigation показывает уведомления**
  - Откройте приложение на мобильном размере (в DevTools)
  - В нижней навигации должна быть иконка 🔔
  - Badge показывает непрочитанные

- [ ] **NotificationCenter НЕ показывается**
  - На мобильном NotificationCenter в Header НЕ отображается

#### Desktop View (≥ 640px)
- [ ] **Header показывает NotificationCenter**
  - Откройте приложение на рабочем столе
  - В Header (справа) должен быть 🔔 с badge

- [ ] **BottomNavigation НЕ показывается**
  - На рабочем столе BottomNavigation НЕ отображается

---

## 🤖 ЧАСТЬ 2: АВТОМАТИЧЕСКОЕ ТЕСТИРОВАНИЕ (Automated Testing)

### ✅ Unit Tests

#### NotificationItem Component
```bash
npm test -- src/components/notifications/__tests__/NotificationItem.test.tsx
```

Тесты:
- [ ] Renders notification message correctly
- [ ] Shows task ID when present
- [ ] Shows unread styling (bg-blue-50) when not read
- [ ] Shows read styling (bg-white) when read
- [ ] Calls onRead callback when button clicked
- [ ] Does NOT render error_message in UI
- [ ] Does NOT render metadata in UI
- [ ] Does NOT render delivery_method in UI

---

#### NotificationList Component
```bash
npm test -- src/components/notifications/__tests__/NotificationList.test.tsx
```

Тесты:
- [ ] Renders notifications list correctly
- [ ] Shows unread count badge
- [ ] Shows "mark all as read" button when unread exist
- [ ] Hides "mark all as read" button when all read
- [ ] Shows "No notifications" when empty
- [ ] Shows loading state while fetching
- [ ] Shows error state on API error

---

#### NotificationStream Service
```bash
npm test -- src/lib/services/__tests__/NotificationStream.test.ts
```

Тесты:
- [ ] Initializes with disconnected status
- [ ] Connects to SSE on connect()
- [ ] Switches to polling after 30s timeout
- [ ] Invalidates React Query cache on SSE message
- [ ] Shows browser notification on SSE message
- [ ] Attempts to reconnect SSE every 60s
- [ ] Disconnects properly on disconnect()
- [ ] Returns correct connection mode (sse/polling/disconnected)
- [ ] Polling is enabled via React Query
- [ ] Polling is disabled when SSE reconnects

---

### ✅ Integration Tests

#### API Integration
```bash
npm test -- src/lib/api/__tests__/notifications.test.ts
```

Тесты (если написаны):
- [ ] `getAll()` fetches all notifications
- [ ] `getUnread()` fetches unread notifications
- [ ] `markAsRead(id)` marks notification as read
- [ ] `markAllAsRead()` marks all as read
- [ ] `getById(id)` fetches single notification

---

#### React Query Hooks
```bash
npm test -- src/lib/hooks/__tests__/useNotifications.test.ts
```

Тесты (если написаны):
- [ ] `useNotifications()` returns notifications data
- [ ] `useNotifications()` has no polling by default (refetchInterval: false)
- [ ] `markAsRead()` mutation invalidates cache
- [ ] `markAllAsRead()` mutation invalidates cache

---

#### Health Check
```bash
npm test -- src/lib/hooks/__tests__/useHealthCheck.test.ts
```

Тесты (если написаны):
- [ ] Fetches health status from API
- [ ] Returns correct structure with active_connections
- [ ] Handles API error gracefully
- [ ] Refreshes on interval

---

### ✅ E2E Tests (если используются)

#### Using Playwright / Cypress
```bash
npm run test:e2e
```

Сценарии:
- [ ] **SSE Connection Flow**
  - Открывает приложение
  - Подтверждает SSE соединение
  - Создает уведомление через API
  - Подтверждает появление в UI

- [ ] **Notification Center**
  - Открывает dropdown
  - Проверяет badge
  - Переходит на страницу всех уведомлений
  - Отмечает уведомления как прочитанные

- [ ] **Polling Fallback**
  - Блокирует SSE соединение
  - Подтверждает переключение на polling
  - Подтверждает восстановление SSE

- [ ] **Offline Mode**
  - Отключает интернет
  - Подтверждает появление индикатора Offline
  - Включает интернет
  - Подтверждает исчезновение индикатора

---

## 🐛 ЧАСТЬ 3: KNOWN ISSUES & EDGE CASES

### Проверка граничных случаев
- [ ] **0 уведомлений** - пустое состояние отображается корректно
- [ ] **1 уведомление** - список с 1 элементом
- [ ] **100+ уведомлений** - прокрутка работает, производительность норм
- [ ] **Очень длинное сообщение** - корректно отображается, не ломает layout
- [ ] **Специальные символы в сообщении** - корректно экранируются, XSS не работает
- [ ] **Результат: 0 непрочитанных** - badge не показывается
- [ ] **Результат: 10+ непрочитанных** - badge показывает "9+"
- [ ] **Быстрое создание 5+ уведомлений** - все появляются в UI, ни одно не потеряно
- [ ] **Отметка как прочитанное во время SSE** - конфликт не возникает

### Тестирование ошибок
- [ ] **API недоступен** - UI показывает ошибку, приложение не падает
- [ ] **Некорректные данные от API** - не ломает приложение, логирует ошибку
- [ ] **Сеть отключена** - offline индикатор появляется, polling работает
- [ ] **SSE разрывается** - переключение на polling корректное
- [ ] **Local Storage полон** - приложение не падает, использует дефолтные значения

---

## 📊 ЧАСТЬ 4: PERFORMANCE TESTING

### Производительность
- [ ] **Initial Load**
  - SSE соединение устанавливается < 1 сек
  - Первые уведомления загружаются < 2 сек
  - UI не блокируется

- [ ] **Large Number of Notifications**
  - 100+ уведомлений рендерятся < 1 сек
  - Прокрутка плавная (60fps)
  - Память не растет при навигации

- [ ] **SSE Message Rate**
  - Обработка 10 сообщений/сек не тормозит UI
  - Cache invalidation не вызывает flicker

- [ ] **Polling Performance**
  - Polling каждые 30 сек не нагружает сеть
  - Нет дублирующихся запросов

---

## ✅ ЧАСТЬ 5: ACCEPTANCE CRITERIA

### Функциональные требования
- [ ] SSE является основным методом получения уведомлений
- [ ] Polling активируется только при SSE timeout/error
- [ ] SSE timeout: 30 сек
- [ ] Polling interval: 30 сек
- [ ] SSE reconnect interval: 60 сек
- [ ] Polling уведомление пользователю: через 5 мин
- [ ] Badge счетчики показывают количество непрочитанных
- [ ] Mark as read работает для одиночного уведомления
- [ ] Mark all as read работает для всех уведомлений
- [ ] Browser notifications показываются (если разрешено)
- [ ] Online/offline индикатор работает автоматически
- [ ] Health check показывает статус всех сервисов
- [ ] Страница /notifications показывает все уведомления
- [ ] NotificationCenter dropdown показывает последние 5

### Нефункциональные требования
- [ ] Приложение не падает при ошибке API
- [ ] Нет утечек памяти
- [ ] UI отзывчивый (60fps)
- [ ] Работает в Chrome, Firefox, Safari, Edge
- [ ] Адаптивный дизайн (mobile + desktop)
- [ ] Логи пишутся только в development режиме
- [ ] Нет дублирующихся запросов к API
- [ ] SSE → React Query cache связь работает
- [ ] Polling отключается при восстановлении SSE

---

## 📝 ЧАСТЬ 6: TEST EXECUTION CHECKLIST

### Перед началом тестирования
- [ ] API сервер запущен и доступен
- [ ] База данных очищена или подготовлена тестовыми данными
- [ ] NEXT_PUBLIC_API_URL настроен корректно
- [ ] DevTools открыт для мониторинга

### Ручное тестирование
- [ ] Выполнить все тесты из ЧАСТИ 1
- [ ] Зафиксировать результаты в таблицу

### Автоматическое тестирование
- [ ] Запустить unit tests: `npm test`
- [ ] Запустить integration tests: `npm test -- tests/integration`
- [ ] Запустить E2E tests (если есть): `npm run test:e2e`
- [ ] Проверить покрытие кода: `npm run test:coverage`

### После тестирования
- [ ] Все тесты проходят
- [ ] Покрытие кода > 80%
- [ ] Нет console ошибок
- [ ] Нет memory leaks
- [ ] Логи в prod режиме отсутствуют (кроме ошибок)

---

## 🚨 ЧАСТЬ 7: CRITICAL PATH

Минимальный набор тестов для быстрой проверки:
1. [ ] SSE соединение устанавливается
2. [ ] Уведомление приходит через SSE в реальном времени
3. [ ] NotificationCenter открывается и показывает уведомления
4. [ ] Badge показывает количество непрочитанных
5. [ ] Mark as read работает
6. [ ] Polling включается при SSE timeout
7. [ ] SSE reconnects через 60 сек
8. [ ] Offline индикатор работает
9. [ ] Health check показывает статусы

---

## 📌 ЧАСТЬ 8: BUG REPORTING TEMPLATE

Если баг найден, заполните:

```
**Тест:** [Название теста из чеклиста]
**Шаги воспроизведения:**
1. 
2. 
3. 

**Ожидаемый результат:** [Что должно произойти]
**Фактический результат:** [Что произошло на самом деле]
**Скриншот:** [Приложить]
**Логи:** [Console/Network скриншоты]
**Браузер:** [Chrome/Firefox/Safari/Edge + версия]
**ОС:** [Windows/Mac/Linux + версия]
**Приоритет:** [Critical/High/Medium/Low]
```

---

**Чеклист готов к использованию!** 🎉
