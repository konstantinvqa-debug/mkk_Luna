# Тестирование API QIWI Кошелька

Тестовое задание для МКК «Луна»

## Описание

Проект содержит автоматизированные тесты для API QIWI Кошелька, реализованные с помощью:

- **Playwright** - для автоматизированного тестирования API
- **Postman** - коллекция тестов для ручного и автоматизированного запуска

Документация API: https://developer.qiwi.com/ru/qiwi-wallet-personal/

## Реализованные тесты

### 1. Проверка доступности сервиса

- Используется endpoint `GET /payment-history/v2/persons/{wallet}/payments`
- Проверяется доступность API и корректность формата ответа
- Валидация структуры JSON согласно документации
- Проверка времени отклика

### 2. Проверка баланса

- Используется endpoint `GET /funding-sources/v2/persons/{personId}/accounts`
- **Ключевое условие: баланс всегда должен быть больше 0**
- Проверка структуры ответа
- Валидация формата данных о балансе

### 3. Создание платежа

- Используется endpoint `POST /sinap/api/v2/terms/99/payments`
- Создание платежа на сумму 1 рубль
- Проверка корректности создания
- Валидация структуры запроса и ответа

### 4. Исполнение платежа

- Используется endpoint `GET /payment-history/v2/transactions/{transactionId}`
- Проверка статуса созданного платежа
- Валидация перехода платежа в статус исполнения
- Проверка корректности данных транзакции

## Структура проекта

```text
mkk_Luna/
├── tests/ # Playwright автотесты
│ ├── config.js # Конфигурация и хелперы
│ ├── 01-service-availability.spec.js
│ ├── 02-balance-check.spec.js
│ ├── 03-create-payment.spec.js
│ └── 04-payment-execution.spec.js
├── postman/
│ ├── collections/ # Postman коллекция
│ └── environments/ # Переменные окружения
│
├── playwright.config.js # Конфигурация Playwright
├── package.json
├── .env.example # Пример переменных окружения
└── README.md
```

## Установка и запуск

### Требования

- Node.js >= 16
- npm или yarn

### Установка зависимостей

```text
npm install
npx playwright install
```

### Настройка переменных окружения

```text
cp .env.example .env
QIWI*API_TOKEN=ваш*токен
QIWI*WALLET=ваш*кошелек
```

## Запуск Playwright тестов

```text
npm test # Все тесты
npm run test:headed # С браузером
npm run test:ui # Интерактивный режим
npm run test:report # Отчёт
```

## Запуск Postman тестов

```text
npm install -g newman
npm run postman:test
```

## Технологии

- **Playwright** - фреймворк для автоматизированного тестирования
- **Node.js** - среда выполнения
- **Postman** - инструменты для API тестирования
- **JavaScript (ES6+)** - язык программирования

## Контакты

```text
Telegram: @konstantinrqa
Email: konstantinrqa@gmail.com
GitHub: github.com/konstantinvqa-debug
```

**Дата выполнения:** 10.06.2026
