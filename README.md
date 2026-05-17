# ShopOnline - Backend API (REST + GraphQL)

This project is a teaching assignment: build a full backend for an e-commerce website supporting both REST and GraphQL (Apollo Server v4) on the same Express server.

Quick start

1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. Install deps: `npm install`
3. Seed sample data: `npm run seed`
4. Start dev server: `npm run dev`

Endpoints

- Swagger (REST): http://localhost:5000/api-docs
- GraphQL: http://localhost:5000/graphql

Project structure

See `src/` for implementation. Includes `config`, `models`, `controllers`, `routes`, `graphql`, `middlewares`, and `utils`.

Seeding

`npm run seed` creates categories, products, and an admin user (email: `admin@example.com`, password: `password123`).

Notes

- REST validation uses Zod.
- JWT auth with `Authorization: Bearer <token>`.
- Admin role protects category/product CRUD and order management.

Deliverables for assignment

- GitHub repo URL (public)
- README.md (this file)
- `.env.example`
- short demo video showing Swagger + GraphQL usage
