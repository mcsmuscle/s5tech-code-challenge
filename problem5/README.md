# Problem 5: A Crude Server

A robust RESTful API built with Express.js, TypeScript, PostgreSQL, and Prisma ORM that provides complete CRUD operations for managing products.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ TypeScript for type safety
- ✅ PostgreSQL database with Prisma ORM
- ✅ Advanced filtering and pagination
- ✅ Input validation
- ✅ Error handling middleware
- ✅ RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Dev Tools**: Nodemon, ts-node

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mcsmuscle/code-challenge.git
cd code-challenge/problem5
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit .env and configure your database connection.

```bash
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[dbname]?schema=public"
PORT=3000
NODE_ENV=development
```

Replace **username**, **password**, and **dbname** with your PostgreSQL credentials.

**Example:**

```bash
DATABASE_URL="postgresql://postgres:123456@localhost:5432/awesome_server?schema=public"
PORT=3000
NODE_ENV=development
```


### 4. Set up the database

Run database migrations:

```bash
npm run prisma:dev
```

### 5. Start the development server

```bash
npm run dev
```

---

# API Endpoints

## Base URL

```
http://localhost:3000/api/products
```

## 1. Create a Product

**Endpoint:** `POST /api/products`

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "isActive": true
}
```

**Response (201 Created):**

```json
{
  "message": "Product created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 2. List Products (with filters)

**Endpoint:** `GET /api/products`

**Query Parameters:**

- `category` (optional): Filter by category
- `isActive` (optional): Filter by active status (true/false)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `sortBy` (optional, default: createdAt): Field to sort by
- `sortOrder` (optional, default: desc): Sort order (asc/desc)

**Example Request:**

```
GET /api/products?category=Electronics&isActive=true&page=1&limit=10&sortBy=price&sortOrder=asc
```

**Response (200 OK):**

```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "Electronics",
      "stock": 50,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## 3. Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response (200 OK):**

```json
{
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 4. Update a Product

**Endpoint:** `PUT /api/products/:id`

**Request Body (all fields optional):**

```json
{
  "name": "Updated Laptop",
  "price": 899.99,
  "stock": 45
}
```

**Response (200 OK):**

```json
{
  "message": "Product updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "Updated Laptop",
    "description": "High-performance laptop",
    "price": 899.99,
    "category": "Electronics",
    "stock": 45,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:01.000Z"
  }
}
```

## 5. Delete a Product

**Endpoint:** `DELETE /api/products/:id`

**Response (200 OK):**

```json
{
  "message": "Product deleted successfully"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP status codes:**

- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error
