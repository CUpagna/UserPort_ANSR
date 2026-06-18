from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db
from models.user import User
from utils.password import hash_password, verify_password

# This router acts like a mini-FastAPI app that we will plug into app.py
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# --- PYDANTIC SCHEMAS ---
# These tell FastAPI exactly what data format to expect from React
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# --- API ROUTES ---

@router.post("/signup")
def signup(user_data: SignupRequest, db: Session = Depends(get_db)):
    # 1. Check if the email is already in the database
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This email is already registered")
    
    # 2. Scramble the password
    hashed_pw = hash_password(user_data.password)
    
    # 3. Create the new user and save them to the database
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 4. Return success to React!
    return {
        "success": True, 
        "message": "Account created successfully!", 
        "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}
    }

@router.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find the user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # 2. Check if the user exists AND if the password matches the hashed version
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # 3. Return success!
    return {
        "success": True, 
        "message": f"Welcome back, {user.name.split(' ')[0]}!", 
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }