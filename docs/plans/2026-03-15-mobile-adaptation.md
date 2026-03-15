# План адаптации ToDowka для мобильных устройств

**Дата**: 2026-03-15
**Статус**: В разработке
**Цель**: Адаптировать веб-приложение ToDowka для удобного использования на мобильных телефонах

---

## Обзор текущего состояния

### Существующая адаптивность (уже хорошо)

✅ **Sidebar**: Адаптивный (оверлей на мобильных, статичный на десктопе)  
✅ **Header**: Есть только для мобильных (lg:hidden)  
✅ **ProjectList**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3  
✅ **MainContent**: p-4 lg:p-8 (адаптивный padding)  
✅ **TaskFilters**: flex-wrap (автоматически переносится на новую строку)  
✅ **QuickCapture**: flex gap-2 (работает на мобильных)

### Проблемы для мобильных устройств

❌ **Dashboard**: grid-cols-3 для статистики (не помещается на мобильных)  
❌ **TaskItem**: Слишком много кнопок в одном месте (Edit, Next, Complete, Delete)  
❌ **TaskForm**: grid-cols-2 для полей (приоритет + проект)  
❌ **Modal**: max-w-lg может быть неудобен на маленьких экранах  
❌ **Touch targets**: Кнопки size="sm" могут быть слишком маленькими для касаний (минимум 44px)  
❌ **Отступы и текст**: Нужна оптимизация для маленьких экранов  
❌ **ProjectCard**: Много кнопок в одной строке

---

## Решения по согласованию с пользователем

### Bottom Navigation
- **Количество пунктов**: 6 (Dashboard, Inbox, Next Actions, Tasks, Projects, More)
- **Индикаторы**: Да, для Inbox и Next Actions (количество задач)
- **Пункты More**: Completed, Areas, Contexts, Tags, Trash, Review

### Меню действий "•••"
- **Действия**: Все (Edit, Delete, Set Waiting, Remove Next Action)
- **Отображение**: Только на мобильных (<640px)

---

## Детальный план реализации

### 1. Создание компонента BottomNavigation (новый)

**Файл**: `src/components/layout/BottomNavigation.tsx`

**Функционал**:
- 6 пунктов: Dashboard, Inbox, Next Actions, Tasks, Projects, More
- Бейджи для Inbox и Next Actions (количество задач)
- Видим только на мобильных (<640px)
- Активное состояние подсвечено
- Иконки + метки (или только иконки для компактности)

**Структура**:
```tsx
interface BottomNavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;  // Опциональный badge для Inbox и Next Actions
}

const navItems: BottomNavigationItem[] = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/inbox', label: 'Inbox', icon: '📥', badge: inboxCount },
  { path: '/tasks/next-actions', label: 'Next Actions', icon: '⚡', badge: nextActionsCount },
  { path: '/tasks', label: 'Tasks', icon: '✓' },
  { path: '/projects', label: 'Projects', icon: '📁' },
  { path: '/more', label: 'More', icon: '⋯' },
];
```

**Интеграция**:
- Использовать `useInbox()` и `useNextActions()` для получения бейджей
- Использовать `usePathname()` для активного состояния
- Использовать `router.push()` для навигации

---

### 2. Создание компонента MoreMenu (новый)

**Файл**: `src/components/layout/MoreMenu.tsx`

**Функционал**:
- Показывает дополнительные пункты навигации
- Меню при клике на More в bottom nav
- Пункты: Completed, Areas, Contexts, Tags, Trash, Review

**Структура**:
```tsx
const moreItems = [
  { path: '/completed', label: 'Completed', icon: '✅' },
  { path: '/areas', label: 'Areas', icon: '🎯' },
  { path: '/contexts', label: 'Contexts', icon: '📍' },
  { path: '/tags', label: 'Tags', icon: '🏷️' },
  { path: '/trash', label: 'Trash', icon: '🗑️' },
  { path: '/review', label: 'Review', icon: '📋' },
];
```

**Интеграция**:
- Dropdown menu при клике на More
- Закрытие при выборе пункта или клике вне меню

---

### 3. Создание компонента TaskActionMenu (новый)

**Файл**: `src/components/task/TaskActionMenu.tsx`

**Функционал**:
- Меню "•••" с действиями: Edit, Delete, Set Waiting, Remove Next Action
- Открывается по клику на кнопку "•••"
- Закрывается при выборе действия или клике вне меню

**Структура**:
```tsx
interface TaskActionMenuProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWaiting: () => void;
  onRemoveNext: () => void;
}

const menuItems = [
  { icon: '✏️', label: 'Edit', action: onEdit },
  { icon: '⏳', label: 'Set Waiting', action: onWaiting, showWhen: task.status !== 'waiting' },
  { icon: '❌', label: 'Remove Next', action: onRemoveNext, showWhen: task.is_next_action },
  { icon: '🗑️', label: 'Delete', action: onDelete },
];
```

---

### 4. Адаптация Sidebar

**Файл**: `src/components/layout/Sidebar.tsx`

**Изменения**:
- Скрыть sidebar на мобильных (уже есть: lg:hidden для оверлея)
- Убедиться, что sidebar скрывается корректно с bottom nav
- Состояние sidebarOpen в useNavigationStore для мобильных

**Логика**:
```tsx
// На мобильных показываем только как оверлей
// На десктопе (>=1024px) показываем статично
```

---

### 5. Адаптация Header

**Файл**: `src/components/layout/Header.tsx`

**Изменения**:
- Скрыть header на мобильных при использовании bottom nav
- Показывать только на планшетах/десктопе
- Или заменить на более компактный вариант

**Логика**:
```tsx
// Header показывать только на sm+ (>=640px)
// На мобильных (<640px) используется BottomNavigation
```

---

### 6. Адаптация TaskItem

**Файл**: `src/components/task/TaskItem.tsx`

**Изменения**:
- Добавить условный рендеринг для мобильных/десктопов
- На мобильных: Complete, Next, ActionMenu (•••)
- На десктопе: Edit, Waiting, Next, Complete, Delete

**Структура**:
```tsx
// Мобильный вид (<640px):
<div className="flex gap-2">
  <Button onClick={() => onComplete?.(task.id)} size="xs">✓</Button>
  {showNextButton && (
    <Button onClick={() => onNextAction?.(task.id)} size="xs">⚡</Button>
  )}
  <Button onClick={() => setActionMenuOpen(true)} size="xs">•••</Button>
</div>

// Десктоп вид (>=640px):
// Текущие кнопки
```

---

### 7. Адаптация TaskForm

**Файл**: `src/components/task/TaskForm.tsx`

**Изменения**:
- Изменить grid-cols-2 на responsive:
  - `<sm`: 1 колонка (стек)
  - `sm+`: 2 колонки

**Структура**:
```tsx
// Было:
<div className="grid grid-cols-2 gap-4">

// Станет:
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

---

### 8. Адаптация Modal

**Файл**: `src/components/ui/Modal.tsx`

**Изменения**:
- Улучшить адаптивность размера
- Добавить scroll внутри на мобильных
- Улучшить close по клику вне области

**Структура**:
```tsx
// Было:
<div className="relative z-10 w-full max-w-lg mx-4">

// Станет:
<div className="relative z-10 w-full max-w-2xl mx-4 sm:mx-6 md:mx-8 max-h-[90vh] overflow-y-auto">
```

---

### 9. Адаптация ProjectCard

**Файл**: `src/components/project/ProjectCard.tsx`

**Изменения**:
- Условный рендеринг для мобильных/десктопов
- На мобильных: Complete, Menu (•••)
- На десктопе: Edit, Complete, Delete

**Структура**:
```tsx
// Мобильный вид (<640px):
<div className="flex gap-2">
  <Button onClick={() => onComplete?.(project.id)} size="xs">✓</Button>
  <Button onClick={() => setActionMenuOpen(true)} size="xs">•••</Button>
</div>
```

---

### 10. Адаптация Dashboard

**Файл**: `src/app/page.tsx`

**Изменения**:
- Статистика: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
- Адаптивные заголовки

**Структура**:
```tsx
// Было:
<section className="grid grid-cols-3 gap-4">

// Станет:
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

### 11. Добавление размера xs в Button

**Файл**: `src/components/ui/Button.tsx`

**Изменения**:
- Добавить размер xs с touch-friendly размерами (min-h-[44px])

**Структура**:
```tsx
const sizeStyles = {
  xs: 'min-h-[44px] px-4 py-3 text-base',  // Для мобильных (touch targets)
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

---

### 12. Адаптация RootLayout

**Файл**: `src/app/layout.tsx`

**Изменения**:
- Добавить BottomNavigation для мобильных
- Условный рендеринг Header и BottomNavigation

**Структура**:
```tsx
<div className="flex min-h-screen flex-col">
  <Header className="hidden sm:flex" />  // Только на sm+
  <div className="flex flex-1">
    <Sidebar className="hidden lg:flex" />
    <MainContent>{children}</MainContent>
  </div>
  <BottomNavigation className="flex sm:hidden" />  // Только на мобильных
</div>
```

---

## Порядок реализации

### Фаза 1: Новые компоненты (Foundation)

- [ ] Создать `TaskActionMenu.tsx` - меню действий для задач
- [ ] Создать `MoreMenu.tsx` - меню дополнительных пунктов
- [ ] Создать `BottomNavigation.tsx` - bottom nav для мобильных
- [ ] Добавить размер xs в `Button.tsx`

### Фаза 2: Адаптация существующих компонентов

- [ ] Адаптировать `TaskItem.tsx` - использовать TaskActionMenu на мобильных
- [ ] Адаптировать `ProjectCard.tsx` - использовать TaskActionMenu на мобильных
- [ ] Адаптировать `TaskForm.tsx` - responsive grid
- [ ] Адаптировать `Modal.tsx` - responsive размеры и scroll

### Фаза 3: Адаптация страниц и layout

- [ ] Адаптировать `Dashboard` - responsive статистика
- [ ] Адаптировать `Header.tsx` - скрыть на мобильных
- [ ] Адаптировать `Sidebar.tsx` - убедиться в корректной работе
- [ ] Адаптировать `RootLayout.tsx` - интеграция BottomNavigation

### Фаза 4: Оптимизации

- [ ] Оптимизация отступов и текста на мобильных
- [ ] Тестирование на разных устройствах
- [ ] Исправление найденных проблем

---

## Детали реализации

### TaskActionMenu - ключевые моменты

**Открытие/закрытие**:
- Использовать useState для isOpen
- Закрывать при клике вне меню (useEffect с document click listener)
- Анимация появления/исчезновения

**Позиционирование**:
- Absolute позиционирование относительно кнопки
- Align: right or bottom
- Z-index: 60 (выше чем modal: 50)

**Условные пункты меню**:
- Set Waiting показывать только если task.status !== 'waiting'
- Remove Next показывать только если task.is_next_action === true

### BottomNavigation - ключевые моменты

**Бейджи**:
- Использовать useInbox() и useNextActions() для получения counts
- Обновлять автоматически при изменении данных
- Показывать badge только если count > 0

**Active state**:
- Подсветка активного пункта (primary цвет)
- Сравнение с pathname

**More menu**:
- При клике на More открывать dropdown
- Показывать выпадающее меню с дополнительными пунктами

### Touch targets

**Минимальный размер**: 44px для всех кнопок на мобильных

**Реализация**:
- Использовать size="xs" для всех кнопок в TaskItem, ProjectCard
- Добавить min-h-[44px] в Button.tsx для size xs
- Проверить все кнопки на достаточный размер для касания

---

## Тестовый план

### Устройства для тестирования
- iPhone SE (375x667) - самый маленький iPhone
- iPhone 12 (390x844) - популярный современный iPhone
- Android (360x640) - типичный Android
- Android (412x915) - большой Android

### Тестовые сценарии
- [ ] Bottom navigation корректно отображается на всех устройствах
- [ ] Бейджи показываются правильно для Inbox и Next Actions
- [ ] Меню "•••" корректно открывается и закрывается
- [ ] Все действия из меню работают (Edit, Delete, Waiting, Remove Next)
- [ ] Touch targets достаточны для всех кнопок
- [ ] Modal корректно отображается на мобильных с scroll
- [ ] TaskForm корректно работает на мобильных (stacked fields)
- [ ] ProjectCard корректно работает на мобильных
- [ ] Navigation работает корректно через BottomNav и Sidebar
- [ ] Header скрыт на мобильных, показан на десктопе

---

## Дополнительные возможности (опционально)

### Safe Areas для iOS
- Обработка notch и home indicator
- Использование `env(safe-area-inset-top)` и `env(safe-area-inset-bottom)`
- Добавление соответствующих отступов

### Pull to Refresh
- Жест для обновления списков задач
- Использование React Native gestures для веба или сторонние библиотеки

### Анимации переходов
- Плавные переходы между экранами
- Использование Framer Motion или React Transition Group

---

## Открытые вопросы

- [ ] Нужно ли добавить safe area handling для iPhone (notch, home indicator)?
- [ ] Нужно ли добавить жест "pull to refresh" для списков задач?
- [ ] Должен ли быть какие-то анимации переходов между экранами?
- [ ] Есть ли специфические требования для различных брендов Android (Samsung, Pixel и т.д.)?

---

## Критерии завершения

- [ ] Все новые компоненты созданы и работают
- [ ] Все существующие компоненты адаптированы для мобильных
- [ ] Bottom navigation работает корректно с бейджами
- [ ] Меню действий работает на мобильных устройствах
- [ ] Touch targets соответствуют рекомендациям (минимум 44px)
- [ ] Приложение протестировано на всех указанных устройствах
- [ ] Все найденные баги исправлены
- [ ] Удовлетворительное пользовательское качество на мобильных устройствах

---

**Документ создан**: 2026-03-15
**Последнее обновление**: 2026-03-15
