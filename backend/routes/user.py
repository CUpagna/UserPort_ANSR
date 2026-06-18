from fastapi import APIRouter, Request # 1. Added Request here
from pydantic import BaseModel

router = APIRouter(prefix="/api/user", tags=["User Profile"])

# 1. Define what data we expect React to send us
class UserUpdate(BaseModel):
    name: str

@router.get("/profile")
def get_profile():
    return {
        "success": True,
        "message": "Profile fetched successfully",
        "user": {} 
    }

# 2. Add the PUT route to handle updates
# Notice we added 'async' and 'request: Request' to stop the browser from blocking it!
@router.put("/profile")
async def update_profile(update_data: UserUpdate, request: Request):
    # In a fully complete app, we would use your JWT token to find your 
    # exact user in the SQLite database and update the row. 
    # For now, we will echo the new name back so the React UI updates successfully!
    return {
        "success": True,
        "message": "Profile updated successfully!",
        "user": {
            "name": update_data.name,
            # We pass back dummy data for the rest of the profile so the UI doesn't break
            "email": "user@example.com", 
            "id": "usr_mocked123"
        }
    }