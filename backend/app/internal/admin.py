from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, Kegiatan
from app.dependencies import db_dependency, user_dependency, admin_dependency


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


# @router.get("/kegiatan")
# def get_kegiatan(db: db_dependency, user: user_dependency):
#     if not user["is_admin"]:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
#         )

#     kegiatan = db.query(User).all().kegiatan
#     return kegiatan
