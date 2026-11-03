# 🚆 IRCTC Backend - Microservices Architecture

> A production-grade microservices-based railway booking system backend, built for learning and demonstrating enterprise architecture patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Services](#services)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This project demonstrates a complete microservices architecture for a railway booking system (IRCTC clone). It's designed as a comprehensive tutorial series covering:

- **Microservices Design Patterns**
- **Inter-Service Communication** (REST, Kafka)
- **Authentication & Authorization** (JWT, OTP)
- **Database Management** (PostgreSQL, Prisma ORM)
- **Caching Strategies** (Redis)
- **Containerization** (Docker, Docker Compose)
- **API Gateway Pattern**
- **Event-Driven Architecture**

**🎓 Learning Objectives:**
- Build scalable microservices from scratch
- Implement real-world authentication flows
- Handle distributed transactions
- Design resilient systems with proper error handling
- Deploy production-ready applications

---

## 🏗️ Architecture
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│          API Gateway (Future)               │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
┌──────▼───────┐ ┌───▼──────────┐ ┌─▼────────────┐
│ User Service │ │Booking Service│ │Payment Service│
│  (Port 4001) │ │  (Port 4002) │ │  (Port 4003) │
└──────┬───────┘ └───┬──────────┘ └─┬────────────┘
       │             │               │
┌──────▼─────────────▼───────────────▼────────┐
│         Kafka (Message Broker)              │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────┐    ┌──────────────┐
│   PostgreSQL    │    │    Redis     │
│  (Port 5432)    │    │  (Port 6379) │
└─────────────────┘    └──────────────┘
```

**Architecture Highlights:**
- **Microservices**: Independent, loosely-coupled services
- **Event-Driven**: Kafka for async communication
- **Database Per Service**: Each service owns its data
- **Caching Layer**: Redis for session management and performance
- **Containerization**: Docker for consistent environments

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Language**: JavaScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Validation**: Zod(Future)
- **Authentication**: JWT, OTP (SendGrid), Google Authentication

### Databases & Caching
- **Primary Database**: PostgreSQL 15
- **Cache**: Redis Stack
- **Message Broker**: Apache Kafka

### DevOps
- **Containerization**: Docker, Docker Compose
- **Database GUI**: pgAdmin
- **Redis GUI**: RedisInsight (included in redis-stack)

### Tools
- **Version Control**: Git, GitHub
- **API Testing**: Postman / Thunder Client
- **Code Quality**: ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download Link |
|------|---------|---------------|
| Node.js | >= 18.0.0 | [nodejs.org](https://nodejs.org/) |
| npm | >= 9.0.0 | (comes with Node.js) |
| Docker | >= 20.0.0 | [docker.com](https://www.docker.com/) |
| Docker Compose | >= 2.0.0 | (included with Docker Desktop) |
| Git | >= 2.30.0 | [git-scm.com](https://git-scm.com/) |

**Verify installations:**
```bash
node --version
npm --version
docker --version
docker-compose --version
git --version
```

---

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/irctc-backend.git
cd irctc-backend
```

#### 2. Start Infrastructure Services
```bash
# Start PostgreSQL, Redis, pgAdmin
docker-compose up -d

# Verify containers are running
docker ps
```

**Services started:**
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:8081` (admin@admin.com / admin)
- Redis: `localhost:6379`
- RedisInsight: `http://localhost:8001`

#### 3. Setup User Service
```bash
# Navigate to user service
cd user-service

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your actual credentials
# See 'Environment Variables' section below

# Initialize Prisma
npx prisma init --datasource-provider postgresql

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

#### 4. Start the Service
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

**Service will be available at**: `http://localhost:4001`

---

### Running the Application

#### Development Mode (All Services)
```bash
# Terminal 1: Start infrastructure
docker-compose up

# Terminal 2: User Service
cd user-service
npm run dev

# Terminal 3: Booking Service (when ready)
cd booking-service
npm run dev

# Terminal 4: Payment Service (when ready)
cd payment-service
npm run dev
```

#### Using Docker Compose (Future)
```bash
# Start all services together
docker-compose --profile all up

# Stop all services
docker-compose --profile all down
```

---

## 📦 Services

### 1. User Service ✅ (Completed)

**Responsibilities:**
- User registration and authentication
- OTP generation and verification (email/SMS)
- JWT token management (access + refresh tokens)
- Refresh Token Rotation
- User profile management
- Google Authentication
- Session management with Redis

**Key Features:**
- ✅ Email OTP verification via SendGrid
- ✅ Rate limiting for OTP requests
- ✅ Secure password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Redis session storage
- ✅ Role-based access control (RBAC)

**Endpoints:**
- `POST /api/auth/send-otp` - Send Register OTP to user's email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

**Tech Stack:**
- Express.js + JavaScript + TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- SendGrid
- JWT

**Status**: ✅ Fully implemented

---

### 2. Booking Service 🚧 (In Progress)

**Responsibilities:**
- Train search and availability
- Seat booking and reservation
- Ticket generation
- Booking cancellation and refunds
- Waitlist management

**Key Features:**
- 🔄 Real-time seat availability
- 🔄 Distributed locking for concurrent bookings
- 🔄 Integration with payment service
- 🔄 Kafka events for booking lifecycle

**Status**: 🚧 Coming in Upcoming Tutorials

---

### 3. Payment Service 🚧 (Planned)

**Responsibilities:**
- Payment processing (Razorpay/Stripe)
- Payment status tracking
- Refund handling
- Transaction history

**Key Features:**
- 🔄 Multiple payment gateways
- 🔄 Idempotent payment processing
- 🔄 Webhook handling
- 🔄 Kafka events for payment status

**Status**: 🚧 Coming in Upcoming Tutorials

---

## 📖 API Documentation

### User Service API

**Base URL**: `http://localhost:4001/api/v1`

#### Authentication Endpoints

##### Register User
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "emailVerified": true,
}

Response: 200 OK
{
  "success": true,
  "message": "OTP sent to email",
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "otpExpiresAt": "2024-01-24T12:35:00Z"
  }
}
```

##### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Full API documentation**: Will be adding this soon

---

## 🔐 Environment Variables

### User Service (`.env`)

Create `user-service/.env` from `.env.example`:
```bash
# Server
PORT=4001
NODE_ENV=development
LOG_LEVEL=info

# Database
DATABASE_URL=postgres://admin:irctcpass@localhost:5432/user_service_database

# Redis
REDIS_URL=redis://:irctcpass@localhost:6379

# JWT Secrets (Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d

# OTP Configuration
OTP_TTL=300
OTP_HMAC_SECRET=your_secret_here
SENDGRID_API_KEY=SG.your_key_here
MAIL_SEND=verified-sender@example.com

# CORS
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:4001
```

**🔒 Security Notes:**
- ❌ **NEVER** commit `.env` files to Git
- ✅ Use `.env.example` for documentation
- ✅ Generate strong secrets (32+ bytes for JWT)
- ✅ Rotate secrets regularly in production
- ✅ Use environment-specific `.env` files

**Generate Secrets:**
```bash
# Generate 32-byte hex secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate 64-byte hex secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Project Structure
