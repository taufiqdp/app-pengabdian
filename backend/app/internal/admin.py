from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, Kegiatan, Pamong
from app.dependencies import db_dependency, user_dependency, admin_dependency
from app.routers.pamong import PamongBase

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def get_users(db: db_dependency, admin: admin_dependency):

    users = db.query(User).filter(User.is_admin == False).all()

    return users


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: db_dependency, admin: admin_dependency):

    user = (
        db.query(User)
        .filter((User.id == user_id))
        .filter(User.is_admin == False)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {"detail": "User deleted"}


@router.get("/pamong")
def get_pamong(db: db_dependency, admin: admin_dependency):
    pamong = db.query(Pamong).all()
    if not pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    return pamong


@router.put("/pamong/{pamong_id}")
def update_pamong(
    pamong_id: int, pamong: PamongBase, db: db_dependency, admin: admin_dependency
):
    pamong_data = db.query(Pamong).filter(Pamong.id == pamong_id).first()

    if not pamong_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    for key, value in pamong.model_dump(exclude_unset=True).items():
        setattr(pamong_data, key, value)

    db.commit()
    db.refresh(pamong_data)

    return {"detail": "Pamong updated"}


@router.delete("/pamong/{pamong_id}")
def delete_pamong(db: db_dependency, pamong_id: int, admin: admin_dependency):
    pamong = db.query(Pamong).filter(Pamong.id == pamong_id).first()

    if not pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    db.delete(pamong)
    db.commit()

    return {"detail": "Pamong deleted"}
