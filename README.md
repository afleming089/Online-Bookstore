# Online Bookstore

A simple Spring Boot + React demo showcasing clean layering and a few design patterns. Backend uses MySQL via Spring Data JPA and Basic Auth with in‑memory users.

## Run

Backend (port 8081):
- cd `spring-boot-backend`
- `mvn -q clean package`
- `mvn -q spring-boot:run`

Frontend (port 5173):
- cd `frontend-react`
- `npm i`
- `npm run dev`

Vite dev proxy forwards `/api` to `http://localhost:8081`.

## Security
- Public: `GET /`, `GET /home`, `GET /error`, `GET /books`, `GET /books/**`
- Admin only: `POST /books`, `PUT /books/{id}`, `DELETE /books/{id}`
- Users:
  - admin / admin123 → ROLE_ADMIN
  - shopper / shopper123 → ROLE_SHOPPER

## Patterns Used
- Factory: media/book creation
- Factory: account concept (in‑memory for demo)
- Strategy-like selection: sort books on browse

## Database
- MySQL required
- Database: `online_bookstore`
- Configure credentials in `spring-boot-backend/application.properties`
