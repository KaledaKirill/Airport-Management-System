# 🧪 Инструкция по тестированию Airport Management System

## 📋 Пошаговое руководство

### Шаг 1: Установка Docker Desktop

**Для Windows:**
1. Скачайте Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Установите и запустите Docker Desktop
3. Убедитесь, что Docker запущен (иконка в трее)

**Проверка:**
```powershell
docker --version
docker-compose --version
```

---

### Шаг 2: Запуск базы данных

**В корне проекта:**
```powershell
docker-compose up -d
```

**Ожидаемый вывод:**
```
[+] Running 2/2
 ✔ Network airport-management-system_default  Created
 ✔ Container airport_db                    Started
```

**Проверка статуса:**
```powershell
docker-compose ps
```

Должен показать `airport_db` со статусом `Up`.

---

### Шаг 3: Применение миграций Prisma

**Создать миграцию:**
```powershell
npx prisma migrate dev --name init
```

**Ожидаемый вывод:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (5.x.x) to .\node_modules\@prisma\client in XXXms

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240212123456_init/
    └─ migration.sql

Applying migration `20240212123456_init`
```

---

### Шаг 4: Заполнение справочников

```powershell
npx prisma db seed
```

**Ожидаемый вывод:**
```
🌱 Starting database seed...
📁 Seeding airlines...
✅ Airlines seeded
📁 Seeding airports...
✅ Airports seeded
📁 Seeding crew positions...
✅ Crew positions seeded
🎉 Seed completed successfully!
```

---

### Шаг 5: Генерация тестовых данных (опционально)

```powershell
npm run seed:data
```

**Ожидаемый вывод:**
```
🎲 Starting test data generation...
📊 Found 8 airlines, 10 airports, 5 crew positions
🧹 Clearing existing data...
✅ Data cleared
...
🎉 Test data generation completed successfully!
📊 Summary:
   - Aircraft: 20
   - Crew members: 30
   - Passengers: 100
   - Flights: 50
   - Tickets: 200
   - Baggage: 300
   - Crew assignments: 100
```

---

### Шаг 6: Запуск сервера

```powershell
npm run start:dev
```

**Ожидаемый вывод:**
```
[10:43:21 AM] Starting compilation...
[10:43:26 AM] Found 0 errors. Watching for file changes.

[10:43:28 AM] File change detected; starting compilation...
[10:43:29 AM] Found 0 errors. Watching for file changes.

[Nest] xxxxx bytes downloaded successfully.
[Nest] xxxxx bytes uploaded successfully.
🚀 Application is running on: http://localhost:3000/api
```

---

## 🧪 Тестирование API

### Тест 1: Получение справочников (без аутентификации)

```powershell
# Получить все авиакомпании
curl http://localhost:3000/api/airlines

# Получить все аэропорты
curl http://localhost:3000/api/airports

# Получить все должности экипажа
curl http://localhost:3000/api/crew-positions
```

**Ожидаемый результат:**
```json
[
  {
    "id": "1",
    "name": "Аэрофлот",
    "iataCode": "SU",
    "country": "Россия"
  },
  {
    "id": "2",
    "name": "Emirates",
    "iataCode": "EK",
    "country": "ОАЭ"
  }
]
```

---

### Тест 2: Создание записи в справочнике (требуется Superuser)

```powershell
curl -X POST http://localhost:3000/api/airlines `
  -H "Content-Type: application/json" `
  -H "X-Superuser: demo-superuser-key-2024" `
  -d '{
    "name": "Test Airlines",
    "iataCode": "TA",
    "country": "Test Country"
  }'
```

**Ожидаемый результат:**
```json
{
  "id": "9",
  "name": "Test Airlines",
  "iataCode": "TA",
  "country": "Test Country"
}
```

**❌ Без Superuser заголовка:**
```json
{
  "statusCode": 403,
  "message": "Superuser access denied: No credentials provided"
}
```

---

### Тест 3: Создание рейса (доступно всем)

```powershell
curl -X POST http://localhost:3000/api/flights `
  -H "Content-Type: application/json" `
  -d '{
    "flightNumber": "SU9999",
    "airlineId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "aircraftId": 1,
    "departureTime": "2024-06-01T10:00:00Z",
    "arrivalTime": "2024-06-01T14:00:00Z"
  }'
```

**Ожидаемый результат:**
```json
{
  "id": "51",
  "flightNumber": "SU9999",
  "status": "scheduled",
  "airline": { "id": "1", "name": "Аэрофлот" },
  "departureAirport": { "id": "1", "name": "Шереметьево", "city": "Москва" },
  "arrivalAirport": { "id": "2", "name": "Dubai International", "city": "Дубай" }
}
```

---

### Тест 4: Бизнес-правило (ошибки)

#### 4.1. Вылет = Прилет (должна быть ошибка)

```powershell
curl -X POST http://localhost:3000/api/flights `
  -H "Content-Type: application/json" `
  -d '{
    "flightNumber": "TEST1",
    "airlineId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 1,
    "aircraftId": 1,
    "departureTime": "2024-06-01T10:00:00Z",
    "arrivalTime": "2024-06-01T14:00:00Z"
  }'
```

**Ожидаемый результат:**
```json
{
  "statusCode": 400,
  "message": [
    "Departure and arrival airports must be different"
  ]
}
```

#### 4.2. Прилет раньше вылета

```powershell
curl -X POST http://localhost:3000/api/flights `
  -H "Content-Type: application/json" `
  -d '{
    "flightNumber": "TEST2",
    "airlineId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "aircraftId": 1,
    "departureTime": "2024-06-01T14:00:00Z",
    "arrivalTime": "2024-06-01T10:00:00Z"
  }'
```

**Ожидаемый результат:**
```json
{
  "statusCode": 400,
  "message": [
    "Arrival time must be after departure time"
  ]
}
```

---

### Тест 5: Специальные endpoints

#### 5.1. Получить экипаж рейса

```powershell
curl http://localhost:3000/api/flights/1/crew
```

#### 5.2. Получить загруженность рейса

```powershell
curl http://localhost:3000/api/flights/1/occupancy
```

**Ожидаемый результат:**
```json
{
  "flightNumber": "SU1234",
  "capacity": 180,
  "bookedTickets": 25,
  "availableSeats": 155,
  "occupancyRate": 0.1389
}
```

---

### Тест 6: Фильтрация рейсов

```powershell
# Рейсы по статусу
curl "http://localhost:3000/api/flights?status=scheduled"

# Рейсы по авиакомпании
curl "http://localhost:3000/api/flights?airlineId=1"

# Рейсы на дату
curl "http://localhost:3000/api/flights?date=2024-06-01"

# Пагинация
curl "http://localhost:3000/api/flights?skip=0&take=10"
```

---

### Тест 7: Admin функции

#### 7.1. Создать бэкап

```powershell
curl -X POST http://localhost:3000/api/admin/backup `
  -H "X-Superuser: demo-superuser-key-2024"
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "filepath": "./backups/airport_backup_2024-02-12_15-30-00.sql.gz"
}
```

#### 7.2. Экспортировать все данные

```powershell
curl -X POST http://localhost:3000/api/admin/export `
  -H "X-Superuser: demo-superuser-key-2024"
```

---

## 🛠 Полезные команды

### Проверка базы данных

```powershell
# Подключиться к PostgreSQL
docker exec -it airport_db psql -U postgres -d airport_db

# SQL команды внутри psql
\dt                    -- Список таблиц
SELECT * FROM airlines;   -- Посмотреть данные
\q                     -- Выход
```

### Перезапуск базы данных

```powershell
docker-compose restart
```

### Остановка базы данных

```powershell
docker-compose down

# Удалить тома (все данные!)
docker-compose down -v
```

### Просмотр логов PostgreSQL

```powershell
docker-compose logs postgres
```

---

## 📊 Проверка данных в базе

### Через Prisma Studio (опционально)

```powershell
npx prisma studio
```

Откроется веб-интерфейс на http://localhost:5555

---

## ❌ Частые проблемы

### 1. `ECONNREFUSED` при миграции

**Проблема:** PostgreSQL ещё не запущен

**Решение:** Подождите 10-15 секунд после `docker-compose up -d`

---

### 2. `FATAL: password authentication failed`

**Проблема:** Неверный пароль в DATABASE_URL

**Решение:** Проверьте `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/airport_db?schema=public"
                                   ^^^^^^^^  ^^^^^^^^
                                   user      password
```

---

### 3. Port 5432 already in use

**Проблема:** Порт уже занят (другой PostgreSQL)

**Решение:** Измените порт в `docker-compose.yml`:
```yaml
ports:
  - '5433:5432'  # Использовать 5433
```

И в `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/airport_db?schema=public"
```

---

### 4. Ошибка 403 при создании в справочнике

**Проблема:** Не передан заголовок Superuser

**Решение:** Добавьте `-H "X-Superuser: demo-superuser-key-2024"`

---

## ✅ Чек-лист перед зачётом

- [ ] Docker Desktop установлен и запущен
- [ ] `docker-compose up -d` выполнен без ошибок
- [ ] `docker ps` показывает `airport_db` в статусе `Up`
- [ ] Миграция применена: `npx prisma migrate dev`
- [ ] Seed выполнен: `npx prisma db seed`
- [ ] Сервер запущен: `npm run start:dev`
- [ ] Браузер открывает `http://localhost:3000/api/flights`

---

## 📦 Файлы для зачёта

Подготовьте архива/репозиторий с:
- ✅ Весь код проекта
- ✅ `docker-compose.yml`
- ✅ `.env.example` (не `.env`!)
- ✅ `README.md` с инструкцией
- ✅ `TESTING.md` (этот фал)

**В `.gitignore` уже добавлено:**
```
.env
node_modules
backups
```

---

Удачи! 🚀
