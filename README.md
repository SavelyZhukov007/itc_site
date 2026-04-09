# ITC site

Обновлённый лендинг для ИТС КИПФИН на Vite + React + TypeScript с локальным backend для сохранения заявок и отправки в Telegram.

## Что изменено

- добавлены анимированные появления секций, карточек и элементов интерфейса;
- переработаны модальные окна: они открываются через быстрый flip / morph-эффект от кнопки;
- обновлены тексты на основе `src/assets/text.txt`;
- в модальные окна добавлены профили руководителей с фотографиями из `src/assets`;
- в шапке логотип вынесен в центр, название — влево, ссылки — вправо;
- добавлен кастомный курсор с состоянием для кликабельных элементов;
- форма теперь отправляется в backend, сохраняется в JSON и может уходить в Telegram-бота.

## Структура

```text
src/
  app/
    components/
    data/
    hooks/
    lib/
    types.ts
  assets/
  styles/
server/
  data/
  index.js
```

## Запуск

Установите зависимости и создайте `.env` на основе примера:

```bash
npm install
cp .env.example .env
```

Запустите backend и фронтенд в двух терминалах:

```bash
npm run server
npm run dev
```

## Скрипты

```bash
npm run dev
npm run build
npm run preview
npm run server
npm run lint
npm run format:check
```

## Настройка формы и Telegram

Заполните в `.env` переменные:

- `TG_BOT_TOKEN` — токен Telegram-бота;
- `TG_CHAT_ID` — чат или канал, куда отправлять заявки;
- `FORM_STORAGE_FILE` — имя JSON-файла для локального сохранения заявок;
- `VITE_API_BASE_URL` — нужен только если backend будет жить на отдельном домене / порту.

Если `TG_BOT_TOKEN` и `TG_CHAT_ID` не заданы, backend всё равно сохраняет заявки в `server/data/applications.json`, но вернёт сообщение о том, что Telegram ещё не настроен.

## Проверка качества

```bash
npm run lint
npm run build
```
