# Study Room Booking Service (srb-api)

CSC337 Advanced Web Technologies - Assignment 1

Student: (apna naam) - Reg No: (apna reg no)

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill `MONGODB_URI` (MongoDB Atlas), `PORT`, `ADMIN_KEY`.
3. `npm run seed` (3 rooms, 18 slots, 3 students)
4. `npm run dev` (or `npm start`)

## REST endpoints (all under `/api/v1`)
| Method | Path | Notes |
|---|---|---|
| GET | `/health` | `{ "status": "ok" }` |
| GET, POST | `/rooms` | list / create |
| GET, PUT, PATCH, DELETE | `/rooms/:roomCode` | `roomCode` cannot change (422) |
| POST | `/slots` | seats copied from room |
| GET | `/slots?roomCode&date&hasSeats=true&page&limit` | filters + paging |
| GET | `/slots/:id` | |
| POST | `/students` | |
| GET | `/students/:regNo` | |
| POST | `/students/:regNo/bookings` | body `{ "slotId": "..." }` |
| GET | `/students/:regNo/bookings` | room name, date, startHour |
| DELETE | `/students/:regNo/bookings/:slotId` | 204 |

Errors always look like `{ "error": { "status": 409, "message": "...", "code": "SLOT_FULL" } }`.

Booking rules: 404 if student or slot missing; 409 `SLOT_FULL` if no seat; 409 `ALREADY_BOOKED` if the student already booked it.
A seat is taken with one atomic `findOneAndUpdate` (`booked < seats`), so two students can never get the last seat.
A unique index on `{ student, slot }` also stops double booking.

## GraphQL
`POST /graphql` (Apollo Server). Queries: `rooms`, `slots(roomCode, date)`, `student(regNo)`.
Mutations: `bookSlot`, `cancelBooking`. Resolvers call the same service functions as REST (no repeated code).
The dashboard query is in `dashboard.graphql`.

### Advantage of GraphQL over REST for the dashboard
With REST the client needs at least two calls (`GET /students/:regNo` and `GET /students/:regNo/bookings`)
and receives every field the server decides to send. With GraphQL one request returns the student and all
bookings together, and the client asks for exactly the fields it needs, so there are fewer round trips and
no over-fetching or under-fetching.

## Socket.IO
- `public/board.html?room=ROOM-01` shows slots and live seats left.
- Client emits `join:room` with the roomCode and gets the slots in the acknowledgement.
- Bookings and cancellations (REST or GraphQL) emit `slot:updated { slotId, seatsLeft }` to that room only.
- `/admin` namespace needs `adminKey` (from `.env`). `public/admin.html` sends `announce` to all boards.
- Board shows connected/disconnected and reloads seats after reconnect.

## Testing
Import `postman/srb-api.postman_collection.json` into Postman (or Thunder Client). Run it in order.

## Diagrams
`docs/architecture.drawio` has 3 pages: Deployment, ER Diagram, Sequence Diagram. Open it with the VS Code "Draw.io Integration" extension or app.diagrams.net.
