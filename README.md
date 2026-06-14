# ShopOnline Backend API

Backend project for an e-commerce assignment using Express, REST, GraphQL, MongoDB, Mongoose, JWT, bcrypt, and Zod.

## Features

- REST API for auth, products, categories, cart, orders, and reviews
- GraphQL API with Apollo Server v4
- MongoDB + Mongoose models and seed data
- JWT authentication and role-based admin access
- Request validation with Zod
- Swagger documentation for REST endpoints

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Apollo Server v4
- JWT + bcryptjs
- Zod
- Swagger UI

## Setup

1. Copy `.env.example` to `.env`
2. Fill `MONGO_URI` and `JWT_SECRET`
3. Install dependencies

```bash
npm install
```

4. Seed sample data

```bash
npm run seed
```

5. Start the server

```bash
npm run dev
```

## API URLs

- Swagger: http://localhost:5000/api-docs
- GraphQL: http://localhost:5000/graphql

## GraphQL Test Commands

Use the GraphQL tester at `/graphql` in this order:

1. Login to get a token

```graphql
mutation {
	login(email: "admin@example.com", password: "password123") {
		token
	}
}
```

2. Copy the token from the response and paste it into `Authorization token`.
	 You can paste it as raw token or with `Bearer ` in front.

3. Test a public query without token

```graphql
query {
	products {
		id
		name
		price
		stock
		category {
			id
			name
		}
	}
}
```

4. Test a protected query with token

```graphql
query {
	me {
		id
		name
		email
		role
	}
}
```

5. Test admin-only queries and mutations with token

```graphql
query {
	users {
		id
		name
		email
		role
	}
}
```

```graphql
mutation {
	createCategory(name: "Books", description: "Books category") {
		id
		name
		description
	}
}
```

```graphql
mutation {
	createProduct(
		name: "Laptop"
		price: 1500
		description: "Work laptop"
		stock: 10
		category: "665000000000000000000001"
	) {
		id
		name
		price
		stock
	}
}
```

## Test Accounts

Use these accounts after running the seed script:

- Admin: `admin@example.com` / `password123`
- User 1: `user1@example.com` / `password123`
- User 2: `user2@example.com` / `password123`

## Seed Products

- Smartphone - `665000000000000000000101`
- Headphones - `665000000000000000000102`
- T-Shirt - `665000000000000000000103`

## Notes

- REST validation is handled by Zod.
- Send JWT in the header: `Authorization: Bearer <token>`.
- Admin role is required for category/product CRUD and order management.

## Submission Checklist

- GitHub repository link
- This README
- `.env.example`
- Postman collection
- 1-2 minute demo video showing login, Swagger, and GraphQL usage
