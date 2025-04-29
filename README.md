# E-commerce Backend API

This is a RESTful API for an e-commerce platform built with Node.js, Express, and PostgreSQL. The API provides functionality for user authentication, product management, shopping cart operations, and admin features.

## Features

- User authentication (register, login)
- Product management (view, create, update, delete)
- Shopping cart functionality (add, update, remove items)
- Admin dashboard (user management, product management)
- Persistent shopping cart across sessions
- Secure user data handling
- Database seeding with sample data

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Unit4-Career-Sim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```bash
   createdb ecommerce_db
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DATABASE_URL=postgres://localhost:5432/ecommerce_db
   JWT_SECRET=your_jwt_secret_here
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PATCH /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/checkout` - Checkout (purchase items)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Sample Users

The database is seeded with the following test users:

1. Admin User
   - Username: admin
   - Password: adminpass123
   - Email: admin@example.com

2. Regular Users
   - Username: testuser1
   - Password: userpass123
   - Email: user1@example.com

   - Username: testuser2
   - Password: userpass456
   - Email: user2@example.com

## Error Handling

The API includes comprehensive error handling:
- Invalid requests return appropriate 4xx status codes
- Server errors return 500 status code
- Detailed error messages are provided in the response

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using middleware
- Input validation and sanitization
- SQL injection prevention using parameterized queries

## Development

To start the server in development mode with auto-reload:
```bash
npm run dev
```

## Testing

To run the test suite:
```bash
npm test
```

## Database schema
<img width="1147" alt="Screenshot 2025-04-29 at 3 12 07 PM" src="https://github.com/user-attachments/assets/b7513852-a924-4b1b-b1a3-1a2f5d130f1e" />


1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
