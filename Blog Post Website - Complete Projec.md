# Blog Post Website - Complete Project Workflow

## Project Objective

Build a full-stack Blog Post Website where:

- Users can Sign Up
- Users can Sign In
- Logged-in users can Create Posts
- Logged-in users can Update their own Posts
- Logged-in users can Delete their own Posts
- Anyone can View Posts

---

# Tech Stack

## Frontend

- React
- React Router DOM
- Axios

## Backend

- Express.js
- JWT Authentication
- Bcrypt Password Hashing

## Database

- MySQL

---

# Concepts Being Evaluated

This project tests:

1. MVC Architecture
2. Middleware
3. Authentication
4. Authorization
5. REST APIs
6. Database Relationships
7. React Router
8. Axios
9. CRUD Operations

---

# Feature Requirements

## Authentication

### Signup

User provides:

- Email
- Password

Account gets created.

---

### Login

User provides:

- Email
- Password

Server validates credentials and returns JWT token.

---

## Blog Posts

### Create Post

Logged-in users can create blog posts.

### Read Posts

Anyone can view blog posts.

### Update Post

Only creator of post can update it.

### Delete Post

Only creator of post can delete it.

---

# Authorization Rule

Example:

User A creates Post A

User B logs in

User B:

❌ Cannot edit Post A

❌ Cannot delete Post A

User A:

✅ Can edit Post A

✅ Can delete Post A

---

# Project Structure

## Backend MVC Structure

```text
backend
│
├── controllers
│   ├── authController.js
│   └── postController.js
│
├── models
│   ├── User.js
│   └── Post.js
│
├── routes
│   ├── authRoutes.js
│   └── postRoutes.js
│
├── middleware
│   ├── authMiddleware.js
│   └── ownershipMiddleware.js
│
├── config
│   └── db.js
│
├── app.js
└── server.js
```

---

# MVC Explanation

## Models

Responsible for database interaction.

Examples:

- User Model
- Post Model

---

## Controllers

Responsible for business logic.

Examples:

- Signup Controller
- Login Controller
- Create Post Controller

---

## Routes

Maps URLs to controllers.

Example:

```js
router.post("/signup", signupController);
```

---

# Database Design

## Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);
```

---

## Posts Table

```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    content TEXT,
    userId INT,
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

# Database Relationship

```text
User
  |
  |
  | One-To-Many
  |
  ↓

Posts
```

One user can create multiple posts.

---

# Backend Development Workflow

## Step 1

Initialize Backend

```bash
npm init -y
```

---

## Step 2

Install Dependencies

```bash
npm install express mysql2 cors dotenv bcrypt jsonwebtoken
```

Development Dependency

```bash
npm install nodemon --save-dev
```

---

## Step 3

Create Express Server

```js
const express = require("express");

const app = express();

app.listen(3000);
```

---

## Step 4

Connect MySQL Database

Create:

```text
config/db.js
```

Use mysql2 package.

---

# Authentication Workflow

## Signup Flow

```text
Frontend
    |
    ↓
POST /signup
    |
    ↓
Hash Password
    |
    ↓
Store User
    |
    ↓
Success Response
```

---

## Password Hashing

Use bcrypt:

```js
bcrypt.hash(password, 10);
```

Never store plain passwords.

---

## Login Flow

```text
Frontend
    |
    ↓
POST /login
    |
    ↓
Find User
    |
    ↓
Compare Password
    |
    ↓
Generate JWT
    |
    ↓
Return Token
```

---

# JWT Authentication

Install:

```bash
npm install jsonwebtoken
```

---

## Generate Token

```js
jwt.sign(
  {
    id: user.id
  },
  SECRET_KEY
);
```

---

## Login Response

```json
{
  "token": "jwt-token"
}
```

---

# Frontend Token Storage

```js
localStorage.setItem("token", token);
```

---

# Middleware

## Purpose

Middleware runs before controller execution.

Example:

```text
Request
   ↓
Middleware
   ↓
Controller
   ↓
Response
```

---

# Authentication Middleware

File:

```text
middleware/authMiddleware.js
```

Responsibilities:

### Read Token

```js
req.headers.authorization
```

---

### Verify Token

```js
jwt.verify(token, SECRET_KEY);
```

---

### Attach User

```js
req.user = decoded;
```

---

### Continue Request

```js
next();
```

---

# Authorization Middleware

File:

```text
middleware/ownershipMiddleware.js
```

Purpose:

Verify user owns post.

---

## Logic

```js
const post = findPost();

if(post.userId !== req.user.id){
    return res.status(403);
}
```

---

# REST APIs

---

## Signup

```http
POST /signup
```

Body:

```json
{
  "email":"test@gmail.com",
  "password":"123456"
}
```

---

## Login

```http
POST /login
```

Body:

```json
{
  "email":"test@gmail.com",
  "password":"123456"
}
```

---

# Posts APIs

---

## Create Post

Protected Route

```http
POST /posts
```

Body:

```json
{
  "title":"My First Blog",
  "content":"Hello World"
}
```

Store:

```js
userId = req.user.id;
```

---

## Get All Posts

Public

```http
GET /posts
```

---

## Get Single Post

Public

```http
GET /posts/:id
```

---

## Update Post

Protected

```http
PATCH /posts/:id
```

Middleware Chain:

```js
authMiddleware
ownershipMiddleware
```

---

## Delete Post

Protected

```http
DELETE /posts/:id
```

Middleware Chain:

```js
authMiddleware
ownershipMiddleware
```

---

# Frontend Setup

Create React App

```bash
npm create vite@latest
```

---

Install Packages

```bash
npm install react-router-dom axios
```

---

# Frontend Structure

```text
src
│
├── pages
│   ├── Signup.jsx
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── CreatePost.jsx
│   ├── EditPost.jsx
│   └── PostDetail.jsx
│
├── components
│   └── Navbar.jsx
│
├── api.js
├── App.jsx
└── main.jsx
```

---

# React Router Setup

Routes:

```text
/
```

Home Page

---

```text
/signup
```

Signup Page

---

```text
/login
```

Login Page

---

```text
/create
```

Create Post

---

```text
/edit/:id
```

Edit Post

---

```text
/post/:id
```

View Single Post

---

# Axios Setup

Create:

```text
api.js
```

```js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
});

export default api;
```

---

# CRUD Operations

## Create

```js
api.post("/posts", data);
```

---

## Read

```js
api.get("/posts");
```

---

## Read One

```js
api.get(`/posts/${id}`);
```

---

## Update

```js
api.patch(`/posts/${id}`, data);
```

---

## Delete

```js
api.delete(`/posts/${id}`);
```

---

# Sending JWT Token

Protected Requests:

```js
api.post(
  "/posts",
  data,
  {
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
);
```

---

# UI Authorization

Show buttons only to owner.

```jsx
if(post.userId === currentUser.id){
   return (
      <>
         <button>Edit</button>
         <button>Delete</button>
      </>
   );
}
```

---

# Testing Checklist

## Authentication

- Signup works
- Login works
- Password hashing works
- JWT generation works

---

## Authorization

- User can edit own post
- User cannot edit others post
- User can delete own post
- User cannot delete others post

---

## CRUD

- Create Post
- View Posts
- View Single Post
- Update Post
- Delete Post

---

# Recommended Development Timeline

## Day 1

- Setup Express
- Setup MySQL
- Create Tables

---

## Day 2

- Signup API
- Login API
- Password Hashing
- JWT Generation

---

## Day 3

- Authentication Middleware

---

## Day 4

- Create Post API
- Get All Posts API
- Get Single Post API

---

## Day 5

- Authorization Middleware
- Update Post API
- Delete Post API

---

## Day 6

- React Setup
- React Router Setup

---

## Day 7

- Signup Page
- Login Page
- Store JWT

---

## Day 8

- Create Post Page
- Edit Post Page
- Delete Post Feature
- View Post Feature

---

## Day 9

- Testing
- Debugging
- Final Submission

---

# Final Architecture Flow

```text
React
   |
Axios
   |
Express Routes
   |
Middleware
(Authentication)
   |
Middleware
(Authorization)
   |
Controller
   |
Model
   |
MySQL Database
```

This flow demonstrates all required concepts:
MVC → Middleware → Authentication → Authorization → REST APIs → React Router → Axios → Database CRUD.