# ТЕХНИЧЕСКОЕ ЗАДАНИЕ
## Разработка серверной части системы управления аэропортом

---

**Дисциплина:** Базы данных  
**Лабораторная работа:** №1 (2 семестр)  
**Тема:** Система управления аэропортом  
**Технологический стек:** Node.js, NestJS, TypeScript, Prisma ORM, PostgreSQL  

---

## СОДЕРЖАНИЕ

1. [Общие сведения](#1-общие-сведения)
2. [Назначение и цели создания системы](#2-назначение-и-цели-создания-системы)
3. [Требования к системе](#3-требования-к-системе)
4. [Структура базы данных](#4-структура-базы-данных)
5. [Архитектура серверной части](#5-архитектура-серверной-части)
6. [API Endpoints](#6-api-endpoints)
7. [Роли пользователей и права доступа](#7-роли-пользователей-и-права-доступа)
8. [Требования к реализации](#8-требования-к-реализации)
9. [Приложения](#9-приложения)

---

## 1. ОБЩИЕ СВЕДЕНИЯ

### 1.1. Наименование системы

**Система управления аэропортом** (Airport Management System)

### 1.2. Основание для разработки

Лабораторная работа №1 второго семестра по дисциплине "Базы данных". 

Работа выполняется на основе лабораторной работы №6 первого семестра с сохранением и расширением ранее реализованного функционала.

### 1.3. Плановые сроки выполнения

Разработка выполняется в рамках учебного семестра согласно графику учебного процесса.

---

## 2. НАЗНАЧЕНИЕ И ЦЕЛИ СОЗДАНИЯ СИСТЕМЫ

### 2.1. Назначение системы

Система предназначена для автоматизации процессов управления аэропортом:

- Управление рейсами и расписанием
- Учет воздушных судов
- Регистрация пассажиров и продажа билетов
- Управление багажом
- Формирование экипажей рейсов
- Ведение справочной информации

### 2.2. Цели создания

1. Разработка полнофункциональной серверной части (backend)
2. Проектирование нормализованной реляционной базы данных
3. Реализация RESTful API
4. Обеспечение целостности и безопасности данных
5. Реализация ролевой модели доступа
6. Получение практических навыков с современным стеком технологий

---

## 3. ТРЕБОВАНИЯ К СИСТЕМЕ

### 3.1. Функциональные требования

#### 3.1.1. Работа с данными

- Просмотр таблиц базы данных
- Фильтрация содержимого таблиц
- Добавление новых записей
- Обновление существующих записей  
- Удаление записей
- Выполнение специальных запросов

#### 3.1.2. Административные функции

- Создание резервных копий БД (суперпользователь)
- Восстановление БД (суперпользователь)
- Экспорт результатов запросов

---

## 4. СТРУКТУРА БАЗЫ ДАННЫХ

### 4.1. Общая характеристика

База данных содержит **10 таблиц**:

**Справочные таблицы (3):**
1. airlines (авиакомпании)
2. airports (аэропорты)  
3. crew_positions (должности экипажа)

**Основные таблицы (7):**
4. **flights** (рейсы) — основная таблица
5. aircraft (воздушные суда)
6. passengers (пассажиры)
7. tickets (билеты)
8. baggage (багаж)
9. crew_members (члены экипажа)
10. crew_assignments (назначения экипажа) — связь многие-ко-многим

### 4.2. Детальное описание таблиц

#### 4.2.1. airlines (Авиакомпании)

**Категория:** Справочная таблица

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK, идентификатор |
| name | VARCHAR(50) | Название, UNIQUE, NOT NULL |
| iata_code | VARCHAR(10) | IATA код (SU, EK), UNIQUE |
| country | VARCHAR(100) | Страна регистрации, NOT NULL |

**Примеры:**
- Аэрофлот: SU, Россия
- Emirates: EK, ОАЭ

---

#### 4.2.2. airports (Аэропорты)

**Категория:** Справочная таблица

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK, идентификатор |
| name | VARCHAR(100) | Название, NOT NULL |
| iata_code | VARCHAR(10) | IATA код (SVO), UNIQUE, NOT NULL |
| city | VARCHAR(100) | Город, NOT NULL |
| country | VARCHAR(100) | Страна, NOT NULL |
| timezone | VARCHAR(10) | Часовой пояс (UTC+3), NOT NULL |

---

#### 4.2.3. crew_positions (Должности экипажа)

**Категория:** Справочная таблица

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| name | VARCHAR(50) | Название должности, UNIQUE, NOT NULL |

**Примеры:** Капитан, Второй пилот, Бортпроводник

---

#### 4.2.4. flights (Рейсы) — ОСНОВНАЯ ТАБЛИЦА

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| flight_number | VARCHAR(20) | Номер рейса (SU123), NOT NULL |
| airline_id | BIGINT | FK → airlines, NOT NULL |
| departure_airport_id | BIGINT | FK → airports, NOT NULL |
| arrival_airport_id | BIGINT | FK → airports, NOT NULL |
| aircraft_id | BIGINT | FK → aircraft, NOT NULL |
| departure_time | TIMESTAMP | Время вылета, NOT NULL |
| arrival_time | TIMESTAMP | Время прилета, NOT NULL |
| status | VARCHAR(20) | Статус, DEFAULT 'scheduled' |
| gate | VARCHAR(10) | Номер гейта, NULL |

**Статусы:** scheduled, boarding, departed, arrived, cancelled, delayed

**Бизнес-правила:**
- departure_airport_id ≠ arrival_airport_id
- arrival_time > departure_time

---

#### 4.2.5. aircraft (Воздушные суда)

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| registration_number | VARCHAR(20) | Бортовой номер, UNIQUE, NOT NULL |
| model | VARCHAR(50) | Модель (Boeing 737-800), NOT NULL |
| manufacturer | VARCHAR(50) | Производитель, NOT NULL |
| airline_id | BIGINT | FK → airlines, NOT NULL |
| capacity | INTEGER | Вместимость, CHECK > 0 |
| year_manufactured | INTEGER | Год производства, CHECK >= 1900 |

---

#### 4.2.6. passengers (Пассажиры)

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| passport_number | VARCHAR(20) | Номер паспорта, UNIQUE, NOT NULL |
| full_name | VARCHAR(100) | ФИО, NOT NULL |
| date_of_birth | DATE | Дата рождения, NOT NULL |
| nationality | VARCHAR(50) | Гражданство, NOT NULL |
| email | VARCHAR(100) | Email, NULL |

---

#### 4.2.7. tickets (Билеты)

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| ticket_number | VARCHAR(30) | Номер билета, UNIQUE, NOT NULL |
| passenger_id | BIGINT | FK → passengers, NOT NULL |
| flight_id | BIGINT | FK → flights, NOT NULL |
| seat_number | VARCHAR(20) | Номер места (12A), NULL |
| class | VARCHAR(20) | Класс (economy/business/first), DEFAULT 'economy' |
| price | DECIMAL(10,2) | Цена, CHECK >= 0 |
| booking_date | TIMESTAMP | Дата бронирования, DEFAULT NOW() |
| status | VARCHAR(20) | Статус, DEFAULT 'booked' |

**Статусы:** booked, checked_in, cancelled

---

#### 4.2.8. baggage (Багаж)

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| ticket_id | BIGINT | FK → tickets, NOT NULL |
| tag_number | VARCHAR(30) | Номер бирки, UNIQUE, NOT NULL |
| weight | DECIMAL(5,2) | Вес (кг), CHECK > 0 AND <= 50 |
| type | VARCHAR(50) | Тип (checked/carry_on/oversized), DEFAULT 'checked' |
| status | VARCHAR(20) | Статус, DEFAULT 'checked_in' |

**Статусы:** checked_in, loaded, in_transit, delivered, lost

---

#### 4.2.9. crew_members (Члены экипажа)

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | PK |
| passport_number | VARCHAR(20) | Номер паспорта, UNIQUE, NOT NULL |
| full_name | VARCHAR(100) | ФИО, NOT NULL |
| crew_position_id | BIGINT | FK → crew_positions, NOT NULL |
| airline_id | BIGINT | FK → airlines, NOT NULL |
| hire_date | DATE | Дата приема на работу, NOT NULL |
| license_number | VARCHAR(50) | Номер лицензии, NULL |

---

#### 4.2.10. crew_assignments (Назначения экипажа)

**Категория:** Связующая таблица (многие-ко-многим)

| Поле | Тип | Описание |
|------|-----|----------|
| crew_member_id | BIGINT | FK → crew_members, PK |
| flight_id | BIGINT | FK → flights, PK |
| assigned_date | TIMESTAMP | Дата назначения, DEFAULT NOW() |

**Составной первичный ключ:** (crew_member_id, flight_id)

**Бизнес-правила:**
- Один член экипажа не может быть назначен на один рейс дважды
- При удалении рейса/члена экипажа — CASCADE

---

### 4.3. Связи между таблицами

**Один-ко-многим:**
- airlines → aircraft, flights, crew_members
- airports → flights (departure), flights (arrival)
- aircraft → flights
- crew_positions → crew_members
- passengers → tickets
- flights → tickets
- tickets → baggage

**Многие-ко-многим:**
- crew_members ↔ flights (через crew_assignments)

---

## 5. АРХИТЕКТУРА СЕРВЕРНОЙ ЧАСТИ

### 5.1. Технологический стек

- **Node.js** (v18+)
- **NestJS** (v10+) — фреймворк
- **TypeScript** (v5+)
- **Prisma ORM** (v5+)
- **PostgreSQL** (v14+)

### 5.2. Структура проекта

```
airport-management-system/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── airlines/
│   ├── airports/
│   ├── crew-positions/
│   ├── flights/
│   ├── aircraft/
│   ├── passengers/
│   ├── tickets/
│   ├── baggage/
│   ├── crew-members/
│   ├── crew-assignments/
│   ├── admin/
│   ├── prisma/
│   ├── common/
│   │   ├── guards/
│   │   └── filters/
│   ├── app.module.ts
│   └── main.ts
├── scripts/
│   ├── seed-data-generator.ts
│   ├── backup.sh
│   └── restore.sh
├── .env
├── package.json
└── README.md
```

---

## 6. API ENDPOINTS

### 6.1. Общий формат

- Префикс: `/api`
- Формат: JSON
- HTTP-методы: GET, POST, PUT, DELETE

### 6.2. Коды ответов

| Код | Описание |
|-----|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

### 6.3. Endpoints по таблицам

#### Airlines (Справочник)

```
GET    /api/airlines        — Получить все
GET    /api/airlines/:id    — Получить по ID
POST   /api/airlines        — Создать (суперпользователь)
PUT    /api/airlines/:id    — Обновить (суперпользователь)
DELETE /api/airlines/:id    — Удалить (суперпользователь)
```

#### Airports (Справочник)

```
GET    /api/airports        — Получить все
GET    /api/airports/:id    — Получить по ID
POST   /api/airports        — Создать (суперпользователь)
PUT    /api/airports/:id    — Обновить (суперпользователь)
DELETE /api/airports/:id    — Удалить (суперпользователь)
```

#### Crew Positions (Справочник)

```
GET    /api/crew-positions        — Получить все
GET    /api/crew-positions/:id    — Получить по ID
POST   /api/crew-positions        — Создать (суперпользователь)
PUT    /api/crew-positions/:id    — Обновить (суперпользователь)
DELETE /api/crew-positions/:id    — Удалить (суперпользователь)
```

#### Flights (Основная таблица)

```
GET    /api/flights                — Получить все (фильтры: airlineId, status, date)
GET    /api/flights/:id            — Получить по ID
POST   /api/flights                — Создать
PUT    /api/flights/:id            — Обновить
DELETE /api/flights/:id            — Удалить
GET    /api/flights/:id/crew       — Получить экипаж рейса
GET    /api/flights/:id/occupancy  — Получить загруженность
```

#### Aircraft

```
GET    /api/aircraft        — Получить все
GET    /api/aircraft/:id    — Получить по ID
POST   /api/aircraft        — Создать
PUT    /api/aircraft/:id    — Обновить
DELETE /api/aircraft/:id    — Удалить
```

#### Passengers

```
GET    /api/passengers              — Получить всех
GET    /api/passengers/:id          — Получить по ID
POST   /api/passengers              — Создать
PUT    /api/passengers/:id          — Обновить
DELETE /api/passengers/:id          — Удалить
GET    /api/passengers/search       — Поиск (query: passport, email)
```

#### Tickets

```
GET    /api/tickets        — Получить все
GET    /api/tickets/:id    — Получить по ID
POST   /api/tickets        — Создать
PUT    /api/tickets/:id    — Обновить
DELETE /api/tickets/:id    — Удалить
```

#### Baggage

```
GET    /api/baggage        — Получить весь багаж
GET    /api/baggage/:id    — Получить по ID
POST   /api/baggage        — Зарегистрировать
PUT    /api/baggage/:id    — Обновить статус
DELETE /api/baggage/:id    — Удалить
```

#### Crew Members

```
GET    /api/crew-members        — Получить всех
GET    /api/crew-members/:id    — Получить по ID
POST   /api/crew-members        — Создать
PUT    /api/crew-members/:id    — Обновить
DELETE /api/crew-members/:id    — Удалить
```

#### Crew Assignments

```
GET    /api/crew-assignments                          — Получить все
POST   /api/crew-assignments                          — Создать назначение
DELETE /api/crew-assignments/:crewMemberId/:flightId  — Удалить назначение
```

#### Admin

```
POST /api/admin/backup   — Создать резервную копию (суперпользователь)
POST /api/admin/restore  — Восстановить БД (суперпользователь)
POST /api/admin/export   — Экспортировать данные
```

---

## 7. РОЛИ ПОЛЬЗОВАТЕЛЕЙ И ПРАВА ДОСТУПА

### 7.1. Роли

1. **Обычный пользователь (User)**
2. **Суперпользователь (Superuser)**

### 7.2. Матрица прав

| Таблица | Просмотр | Создание | Изменение | Удаление |
|---------|----------|----------|-----------|----------|
| **Справочники** |
| airlines | Все | Super | Super | Super |
| airports | Все | Super | Super | Super |
| crew_positions | Все | Super | Super | Super |
| **Основные** |
| flights | Все | Все | Все | Все |
| aircraft | Все | Все | Все | Все |
| passengers | Все | Все | Все | Все |
| tickets | Все | Все | Все | Все |
| baggage | Все | Все | Все | Все |
| crew_members | Все | Все | Все | Все |
| crew_assignments | Все | Все | Все | Все |

**Административные функции:** только суперпользователь

---

## 8. ТРЕБОВАНИЯ К РЕАЛИЗАЦИИ

### 8.1. Prisma Schema

Пример файла `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Airlines {
  id        BigInt     @id @default(autoincrement())
  name      String     @unique @db.VarChar(50)
  iataCode  String?    @unique @map("iata_code") @db.VarChar(10)
  country   String     @db.VarChar(100)
  
  aircraft      Aircraft[]
  flights       Flights[]
  crewMembers   CrewMembers[]

  @@map("airlines")
}

model Flights {
  id                  BigInt      @id @default(autoincrement())
  flightNumber        String      @map("flight_number") @db.VarChar(20)
  airlineId           BigInt      @map("airline_id")
  departureAirportId  BigInt      @map("departure_airport_id")
  arrivalAirportId    BigInt      @map("arrival_airport_id")
  aircraftId          BigInt      @map("aircraft_id")
  departureTime       DateTime    @map("departure_time")
  arrivalTime         DateTime    @map("arrival_time")
  status              String      @default("scheduled") @db.VarChar(20)
  gate                String?     @db.VarChar(10)
  
  airline           Airlines    @relation(fields: [airlineId], references: [id])
  departureAirport  Airports    @relation("DepartureAirport", fields: [departureAirportId], references: [id])
  arrivalAirport    Airports    @relation("ArrivalAirport", fields: [arrivalAirportId], references: [id])
  aircraft          Aircraft    @relation(fields: [aircraftId], references: [id])
  
  tickets          Tickets[]
  crewAssignments  CrewAssignments[]

  @@map("flights")
}

model CrewAssignments {
  crewMemberId  BigInt    @map("crew_member_id")
  flightId      BigInt    @map("flight_id")
  assignedDate  DateTime  @default(now()) @map("assigned_date")
  
  crewMember  CrewMembers  @relation(fields: [crewMemberId], references: [id], onDelete: Cascade)
  flight      Flights      @relation(fields: [flightId], references: [id], onDelete: Cascade)

  @@id([crewMemberId, flightId])
  @@map("crew_assignments")
}

// Остальные модели...
```

### 8.2. Первичное наполнение БД

Файл `prisma/seed.ts` для заполнения справочников:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Airlines
  await prisma.airlines.createMany({
    data: [
      { name: 'Аэрофлот', iataCode: 'SU', country: 'Россия' },
      { name: 'Emirates', iataCode: 'EK', country: 'ОАЭ' },
      { name: 'Lufthansa', iataCode: 'LH', country: 'Германия' },
    ]
  });

  // Airports
  await prisma.airports.createMany({
    data: [
      { name: 'Шереметьево', iataCode: 'SVO', city: 'Москва', country: 'Россия', timezone: 'UTC+3' },
      { name: 'Dubai International', iataCode: 'DXB', city: 'Дубай', country: 'ОАЭ', timezone: 'UTC+4' },
    ]
  });

  // Crew Positions
  await prisma.crewPositions.createMany({
    data: [
      { name: 'Капитан' },
      { name: 'Второй пилот' },
      { name: 'Бортпроводник' },
    ]
  });

  console.log('✅ Database seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Запуск:
```bash
npx prisma db seed
```

### 8.3. Генератор тестовых данных

Используйте `@faker-js/faker` для генерации сотен записей:

```bash
npm install @faker-js/faker --save-dev
ts-node scripts/seed-data-generator.ts
```

### 8.4. Резервное копирование

**Создание бэкапа** (`scripts/backup.sh`):

```bash
#!/bin/bash
DB_NAME="airport_db"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="./backups/airport_backup_${TIMESTAMP}.sql"

mkdir -p ./backups
pg_dump -U postgres -d $DB_NAME -F p -f $BACKUP_FILE
gzip $BACKUP_FILE
echo "✅ Backup created: ${BACKUP_FILE}.gz"
```

**Восстановление** (`scripts/restore.sh`):

```bash
#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    exit 1
fi

gunzip -k $1
psql -U postgres -d airport_db < ${1%.gz}
echo "✅ Database restored"
```

### 8.5. Команды для запуска

```bash
# Установка
npm install

# Инициализация Prisma
npx prisma init

# Создание миграций
npx prisma migrate dev --name init

# Генерация Prisma Client
npx prisma generate

# Заполнение справочников
npx prisma db seed

# Генерация тестовых данных
ts-node scripts/seed-data-generator.ts

# Запуск сервера
npm run start:dev

# Создание бэкапа
./scripts/backup.sh

# Восстановление
./scripts/restore.sh backups/airport_backup_2024-02-12.sql.gz
```

---

## 9. ПРИЛОЖЕНИЯ

### 9.1. Примеры SQL-запросов

#### Рейсы из Москвы

```sql
SELECT 
  f.flight_number,
  a.name AS airline,
  dep.city AS from_city,
  arr.city AS to_city,
  f.departure_time
FROM flights f
JOIN airlines a ON f.airline_id = a.id
JOIN airports dep ON f.departure_airport_id = dep.id
JOIN airports arr ON f.arrival_airport_id = arr.id
WHERE dep.city = 'Москва'
ORDER BY f.departure_time;
```

#### Экипаж рейса

```sql
SELECT 
  cm.full_name,
  cp.name AS position
FROM crew_assignments ca
JOIN crew_members cm ON ca.crew_member_id = cm.id
JOIN crew_positions cp ON cm.crew_position_id = cp.id
WHERE ca.flight_id = 1;
```

#### Загруженность рейса

```sql
SELECT 
  f.flight_number,
  ac.capacity,
  COUNT(t.id) AS booked_tickets,
  ac.capacity - COUNT(t.id) AS available_seats
FROM flights f
JOIN aircraft ac ON f.aircraft_id = ac.id
LEFT JOIN tickets t ON t.flight_id = f.id AND t.status != 'cancelled'
WHERE f.id = 1
GROUP BY f.id, f.flight_number, ac.capacity;
```

### 9.2. Глоссарий

| Термин | Определение |
|--------|-------------|
| ACID | Atomicity, Consistency, Isolation, Durability |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| IATA | Код авиакомпании/аэропорта (2-3 буквы) |
| ORM | Object-Relational Mapping |
| REST | Representational State Transfer |

---

## ЗАКЛЮЧЕНИЕ

Техническое задание определяет требования к разработке серверной части системы управления аэропортом.

**Система обеспечивает:**
- Эффективное хранение данных
- RESTful API
- Ролевую модель доступа
- Целостность информации
- Масштабируемость

**Дата:** 12 февраля 2026 г.  
**Версия:** 1.0
