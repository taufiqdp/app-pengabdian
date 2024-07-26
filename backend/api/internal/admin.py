from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.models import User, Kegiatan
from api.dependencies import db_dependency, user_dependency


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/user")
def get_user(db: db_dependency, user: user_dependency):
    if not user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    users = db.query(User).filter(User.is_admin == False).all()
    return users
