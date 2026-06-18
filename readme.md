# UserVault

A full-stack authentication and user management application built with React, FastAPI, SQLite, and SQLAlchemy.

## Features

* User Registration
* User Login & Authentication
* Secure Password Hashing using BCrypt
* User Profile Management
* Protected Routes
* SQLite Database Integration
* FastAPI REST APIs
* Responsive React Frontend
* Input Validation and Error Handling

## Tech Stack

### Frontend

* React
* React Router DOM
* Axios
* CSS

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* BCrypt
* Uvicorn

## Project Structure

```text
uservault/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.py
│   ├── requirements.txt
│   └── uservault.db
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/<your-username>/uservault.git
cd uservault
```

## Backend Setup

```bash
cd backend

python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

Backend will run on:

```text
http://localhost:8000
```

## Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend will run on:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | /api/auth/signup  | Register User       |
| POST   | /api/auth/login   | Login User          |
| GET    | /api/user/profile | Get User Profile    |
| PUT    | /api/user/profile | Update User Profile |

## Security Features

* BCrypt Password Hashing
* Input Validation
* Protected Routes
* Secure Authentication Workflow
* Email Uniqueness Validation

## Future Improvements

* JWT Authentication
* Refresh Tokens
* Email Verification
* Password Reset
* Docker Deployment
* PostgreSQL Support
* Role-Based Access Control