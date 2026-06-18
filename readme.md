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

## Assumptions Made During Development

1. Each user is uniquely identified by their email address, and duplicate email registrations are not allowed.

2. The application is intended for small to medium-scale usage; therefore, SQLite was chosen as the database for simplicity and ease of deployment.

3. User authentication is limited to email and password credentials, and third-party authentication providers (Google, GitHub, etc.) are outside the current scope.

4. The backend APIs are designed to be stateless, enabling future migration to scalable deployment environments without significant architectural changes.

5. User profile data consists only of essential information (name and email), and advanced profile features such as profile pictures, preferences, or social integrations are not considered.

6. The project focuses on demonstrating secure authentication and user management workflows rather than enterprise-level security features such as multi-factor authentication, role-based access control, or audit logging.
