from sqlalchemy import Column, String, DateTime
from datetime import datetime
import uuid
from .database import Base

class User(Base):
    __tablename__ = "users"

    # We use a UUID string as the primary key instead of a generic integer (e.g., 'usr_abc123')
    id = Column(String, primary_key=True, index=True, default=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Never store plain passwords!
    joined_at = Column(DateTime, default=datetime.utcnow)