# Node.js Auth API

A simple authentication API using Node.js, Express, and MySQL.

## Features

- User registration
- User login
- Logout
- JWT token verification
- MySQL for data storage

## API Endpoints

- POST /api/register - Register a new user
- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/protected - Protected endpoint (requires token)

## Dependencies

- express: ^4.17.1
- mysql2: ^2.3.0
- jsonwebtoken: ^8.5.1
- bcryptjs: ^2.4.3
- dotenv: ^10.0.0
