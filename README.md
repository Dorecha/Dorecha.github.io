# Kill Team Mission Generator

Простой генератор случайных миссий для Kill Team.

## Структура

- `index.html` — русская версия интерфейса.
- `en.html` — английская версия интерфейса.
- `js/app.js` — общая логика приложения.
- `js/mission-core.js` — фильтрация, случайный выбор и валидация.
- `js/missions-ru.js` / `js/missions-en.js` — данные миссий.
- `js/maps.js` — рендеринг SVG-карт миссий.
- `tests/` — тесты общей логики.

## Проверка

```bash
npm test
```
