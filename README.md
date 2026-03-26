# Node App 

##  Project Overview

This is a Node.js backend application built using Express and MongoDB.
It includes authentication, role-based access control (RBAC), and menu management.

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

##  Project Structure

```
node_app/
│
├── config/           # Database connection
├── controllers/      # Business logic
├── middlewares/      # Auth & role middleware
├── models/           # Mongoose schemas
├── routes/           # API routes
├── seeders/          # Seed scripts for DB
├── utils/            # Utility functions
├── app.js            # Express app setup
├── server.js         # Entry point
├── package.json
```

---

##  Setup Instructions

###  Clone the repository

```
git clone https://github.com/kunthavaip-png/node_app.git
cd node_app
```

###  Install dependencies

```
npm install
```

###  Setup environment variables

Create a `.env` file in root:

```
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Run the Application

```
node server.js
```

Server will run at:

```
http://localhost:3001
```

---

##  Authentication APIs

### Login

```
POST /api/login
```

**Body:**

```
{
  "username": "admin",
  "password": "1234"
}
```

---

##  User Management

### Add User (Admin only)

```
POST /api/adduser
```

**Headers:**

```
Authorization: Bearer <token>
```

---

## 🔑 Features

* JWT Authentication
* Role-based Authorization (Admin / HR)
* Menu access based on roles
* Clean modular architecture

---

##  Notes

* Do not commit `.env` file
* Use `.env.example` for reference
* Run seeders before testing APIs

---

##  Author

Kunthavai
