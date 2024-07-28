from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv

from typing import Annotated
import os

from app.models import User
from app.dependencies import bcrypt_context, db_dependency


load_dotenv(override=True)
router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


class UserCreateRequest(BaseModel):
    username: str
    password: str


class AdminCreateRequest(UserCreateRequest):
    is_admin: bool


class Token(BaseModel):
    access_token: str
    token_type: str


def authenticate_user(username: str, password: str, db: db_dependency):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False

    if not bcrypt_context.verify(password, user.password):
        return False

    return user


def create_access_token(username: dict, user_id, is_admin, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id, "is_admin": is_admin}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/user", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreateRequest, db: db_dependency):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    new_user = User(username=user.username, password=bcrypt_context.hash(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "User created successfully"}


@router.post("/admin", status_code=status.HTTP_201_CREATED)
async def create_admin(user: AdminCreateRequest, db: db_dependency):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    new_user = User(
        username=user.username,
        password=bcrypt_context.hash(user.password),
        is_admin=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "Admin created successfully"}


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        user.username, user.id, user.is_admin, timedelta(days=30)
    )

    return {"access_token": access_token, "token_type": "bearer"}
