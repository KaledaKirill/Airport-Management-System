# Airport Management System

Серверная часть системы управления аэропортом на основе NestJS, Prisma ORM и PostgreSQL.

## Технологический стек

- **Node.js** v18+
- **NestJS** v10+
- **TypeScript** v5+
- **Prisma ORM** v5+
- **PostgreSQL** v14+

## Структура базы данных

### Справочные таблицы (3)
- `airlines` - авиакомпании
- `airports` - аэропорты
- `crew_positions` - должности экипажа

### Основные таблицы (7)
- `flights` - рейсы (основная таблица)
- `aircraft` - воздушные суда
- `passengers` - пассажиры
- `tickets` - билеты
- `baggage` - багаж
- `crew_members` - члены экипажа
- `crew_assignments` - назначения экипажа (многие-ко-многим)

## Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных PostgreSQL

Создайте базу данных:

```sql
CREATE DATABASE airport_db;
```

### 3. Настройка переменных окружения

Файл `.env` уже создан. Измените параметры подключения:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/airport_db?schema=public"
PORT=3000
SUPERUSER_API_KEY="demo-superuser-key-2024"
```

### 4. Применение миграций Prisma

```bash
npx prisma migrate dev --name init
```

### 5. Генерация Prisma Client

```bash
npx prisma generate
```

### 6. Заполнение справочников

```bash
npx prisma db seed
```

### 7. Генерация тестовых данных (опционально)

```bash
npm run seed:data
```

### 8. Запуск сервера

```bash
# Режим разработки
npm run start:dev

# Продакшн режим
npm run build
npm run start:prod
```

Сервер будет доступен по адресу: `http://localhost:3000/api`

## API Endpoints

### Справочники (только чтение для обычных пользователей)

#### Airlines
```
GET    /api/airlines        — Получить все авиакомпании
GET    /api/airlines/:id    — Получить по ID
POST   /api/airlines        — Создать (только суперпользователь)
PUT    /api/airlines/:id    — Обновить (только суперпользователь)
DELETE /api/airlines/:id    — Удалить (только суперпользователь)
```

#### Airports
```
GET    /api/airports        — Получить все аэропорты
GET    /api/airports/:id    — Получить по ID
POST   /api/airports        — Создать (только суперпользователь)
PUT    /api/airports/:id    — Обновить (только суперпользователь)
DELETE /api/airports/:id    — Удалить (только суперпользователь)
```

#### Crew Positions
```
GET    /api/crew-positions        — Получить все должности
GET    /api/crew-positions/:id    — Получить по ID
POST   /api/crew-positions        — Создать (только суперпользователь)
PUT    /api/crew-positions/:id    — Обновить (только суперпользователь)
DELETE /api/crew-positions/:id    — Удалить (только суперпользователь)
```

### Основные таблицы (полный CRUD для всех)

#### Flights
```
GET    /api/flights                — Получить все рейсы
GET    /api/flights/:id            — Получить по ID
GET    /api/flights/:id/crew       — Получить экипаж рейса
GET    /api/flights/:id/occupancy  — Получить загруженность рейса
POST   /api/flights                — Создать рейс
PUT    /api/flights/:id            — Обновить рейс
DELETE /api/flights/:id            — Удалить рейс
```

#### Aircraft
```
GET    /api/aircraft        — Получить все ВС
GET    /api/aircraft/:id    — Получить по ID
POST   /api/aircraft        — Создать ВС
PUT    /api/aircraft/:id    — Обновить ВС
DELETE /api/aircraft/:id    — Удалить ВС
```

#### Passengers
```
GET    /api/passengers              — Получить всех пассажиров
GET    /api/passengers/:id          — Получить по ID
GET    /api/passengers/search       — Поиск (query: passport, email)
POST   /api/passengers              — Создать пассажира
PUT    /api/passengers/:id          — Обновить пассажира
DELETE /api/passengers/:id          — Удалить пассажира
```

#### Tickets
```
GET    /api/tickets        — Получить все билеты
GET    /api/tickets/:id    — Получить по ID
POST   /api/tickets        — Создать билет
PUT    /api/tickets/:id    — Обновить билет
DELETE /api/tickets/:id    — Удалить билет
```

#### Baggage
```
GET    /api/baggage        — Получить весь багаж
GET    /api/baggage/:id    — Получить по ID
POST   /api/baggage        — Зарегистрировать багаж
PUT    /api/baggage/:id    — Обновить статус
DELETE /api/baggage/:id    — Удалить багаж
```

#### Crew Members
```
GET    /api/crew-members        — Получить весь экипаж
GET    /api/crew-members/:id    — Получить по ID
POST   /api/crew-members        — Создать члена экипажа
PUT    /api/crew-members/:id    — Обновить члена экипажа
DELETE /api/crew-members/:id    — Удалить члена экипажа
```

#### Crew Assignments
```
GET    /api/crew-assignments                          — Получить все назначения
POST   /api/crew-assignments                          — Создать назначение
DELETE /api/crew-assignments/:crewMemberId/:flightId  — Удалить назначение
```

### Admin (только суперпользователь)

```
POST   /api/admin/backup   — Создать резервную копию
POST   /api/admin/restore  — Восстановить БД
POST   /api/admin/export   — Экспортировать все данные
GET    /api/admin/backups  — Список доступных бэкапов
```

## Аутентификация суперпользователя

Для доступа к административным функциям и модификации справочников добавьте заголовок:

```
X-Superuser: demo-superuser-key-2024
```

## Примеры запросов

### Получить все рейсы
```bash
curl http://localhost:3000/api/flights
```

### Создать новый рейс
```bash
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "flightNumber": "SU1234",
    "airlineId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "aircraftId": 1,
    "departureTime": "2024-06-01T10:00:00Z",
    "arrivalTime": "2024-06-01T14:00:00Z"
  }'
```

### Создать авиакомпанию (только суперпользователь)
```bash
curl -X POST http://localhost:3000/api/airlines \
  -H "Content-Type: application/json" \
  -H "X-Superuser: demo-superuser-key-2024" \
  -d '{
    "name": "Test Airlines",
    "iataCode": "TT",
    "country": "Test Country"
  }'
```

### Получить экипаж рейса
```bash
curl http://localhost:3000/api/flights/1/crew
```

### Получить загруженность рейса
```bash
curl http://localhost:3000/api/flights/1/occupancy
```

## Резервное копирование

### Через API
```bash
curl -X POST http://localhost:3000/api/admin/backup \
  -H "X-Superuser: demo-superuser-key-2024"
```

### Через bash скрипты (Linux/Mac)
```bash
# Создать бэкап
./scripts/backup.sh

# Восстановить из бэкапа
./scripts/restore.sh backups/airport_backup_2024-02-12_15-30-00.sql.gz
```

## Структура проекта

```
airport-management-system/
├── prisma/
│   ├── schema.prisma          # Схема БД
│   ├── migrations/           # Миграции
│   └── seed.ts              # Заполнение справочников
├── scripts/
│   ├── seed-data-generator.ts  # Генератор тестовых данных
│   ├── backup.sh            # Скрипт бэкапа
│   └── restore.sh           # Скрипт восстановления
├── src/
│   ├── airlines/            # Модуль авиакомпаний
│   ├── airports/            # Модуль аэропортов
│   ├── crew-positions/      # Модуль должностей
│   ├── flights/             # Модуль рейсов
│   ├── aircraft/            # Модуль ВС
│   ├── passengers/          # Модуль пассажиров
│   ├── tickets/             # Модуль билетов
│   ├── baggage/             # Модуль багажа
│   ├── crew-members/        # Модуль экипажа
│   ├── crew-assignments/    # Модуль назначений
│   ├── admin/               # Админ модуль
│   ├── common/              # Общие компоненты
│   │   ├── guards/          # Guards (SuperuserGuard)
│   │   └── decorators/      # Декораторы
│   ├── prisma/             # Prisma service
│   ├── app.module.ts
│   └── main.ts
├── .env                    # Переменные окружения
├── package.json
└── README.md
```

## Бизнес-правила

### Flights
- `departure_airport_id ≠ arrival_airport_id`
- `arrival_time > departure_time`

### Baggage
- `weight > 0 AND weight <= 50`

### Crew Assignments
- Один член экипажа не может быть назначен на один рейс дважды

## Лицензия

MIT
