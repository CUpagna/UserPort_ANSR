import bcrypt

def hash_password(password: str) -> str:
    # Generate a random salt and hash the password
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # We decode it back to a standard string so it can be saved in SQLite easily
    return hashed_pw.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Check the plain text password against the hashed version from the database
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )