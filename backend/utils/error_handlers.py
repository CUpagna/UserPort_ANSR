from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

def register_error_handlers(app):
    
    # Handles standard HTTP errors (e.g., 400 Bad Request, 404 Not Found)
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False, 
                "message": exc.detail
            },
        )

    # Handles data validation errors (e.g., missing email in signup)
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False, 
                "message": "Invalid input data", 
                "details": exc.errors()
            },
        )

    # Catch-all for any unexpected server crashes (500 Internal Server Error)
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False, 
                "message": "An unexpected server error occurred."
            },
        )