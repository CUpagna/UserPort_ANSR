from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.error_handlers import register_error_handlers
from models.database import engine, Base
import models.user 
from routes.auth import router as auth_router 

# 1. IMPORT THE NEW USER ROUTER
from routes.user import router as user_router 

# This line is the magic! It creates the database tables if they don't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register our custom error handlers
register_error_handlers(app)

# --- IMPORTANT: CORS Setup ---
# This allows your React frontend (localhost:3000) to talk to your Python backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Plug in the authentication routes (signup, login)
app.include_router(auth_router)

# 2. PLUG IN THE USER ROUTES
app.include_router(user_router)

@app.get("/")
def read_root():
    return {"message": "UserVault API is running!"}