# Athlex API

Backend for **Athlex** — a fitness platform for athletes, trainers, and gym communities.

Built with NestJS, GraphQL, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| API | GraphQL (Apollo Server) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Uploads | Cloudinary |
| Real-time | WebSockets (Socket.io) |

---

## Features

- **Auth** — JWT-based login, signup, token refresh
- **Members** — Profiles, roles (Member / Trainer / Admin), rank points
- **Training Programs** — Create, manage, and enroll in programs
- **Paid Enrollment** — Order creation with simulated payment (auto-PAID for program orders)
- **Workout Builder** — Weekly workout plans with exercises
- **Orders** — Order management with status tracking
- **Products** — Product catalog with stock management
- **Progress Results** — Member progress posts per program
- **Bookmarks** — Bookmark programs and trainers
- **Likes / Views / Follows** — Social engagement tracking
- **Notifications** — Order updates and system alerts
- **AI Module** — AI coach integration
- **Admin Panel** — Full control over members, programs, orders

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- MongoDB running locally or via Atlas

### Install

```bash
yarn install
```

### Environment

Create `.env`:

```env
MONGO_DB_URI=mongodb://localhost:27017/athlex
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3003
```

### Run

```bash
yarn start:dev       # Development (watch mode)
yarn build           # Production build
yarn start:prod      # Start production server
```

GraphQL Playground: `http://localhost:3003/graphql`

---

## Project Structure

```
apps/athlex/src/
├── components/         # Feature modules
│   ├── auth/           # Login, signup, JWT
│   ├── member/         # Member CRUD + queries
│   ├── training-program/ # Programs + enrollment
│   ├── workout/        # Workout plans
│   ├── exercise/       # Exercise library
│   ├── order/          # Orders + payment
│   ├── product/        # Product catalog
│   ├── progress-result/ # Member progress posts
│   ├── notification/   # Notification system
│   ├── bookmark/       # Bookmarks
│   ├── like/           # Likes
│   ├── follow/         # Follows
│   ├── view/           # View tracking
│   ├── comment/        # Comments
│   ├── ai/             # AI coach
│   └── admin/          # Admin operations
└── libs/
    ├── dto/            # GraphQL input/output types
    ├── enums/          # Shared enums
    ├── schemas/        # Mongoose schemas
    └── types/          # Shared TypeScript types
```

---

## Frontend

The frontend is a separate Next.js app. See [athlex-web](https://github.com/davlatjanov/athlex-web) for setup.

---

## License

Private — all rights reserved.
