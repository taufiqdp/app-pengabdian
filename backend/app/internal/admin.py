from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.models import User, Kegiatan
from app.dependencies import db_dependency, user_dependency


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/user")
def get_user(db: db_dependency, user: user_dependency):
    if not user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    users = db.query(User).filter(User.is_admin == False).all()

    users_dict = []
    for user in users:
        kegiatan = db.query(Kegiatan).filter(Kegiatan.user_id == user.id).all()
        users_dict.append(
            {
                "id": user.id,
                "username": user.username,
                "kegiatan": [
                    {
                        "id": k.id,
                        "nama_kegiatan": k.nama_kegiatan,
                        "tanggal": k.tanggal,
                        "tempat": k.tempat,
                        "deskripsi": k.deskripsi,
                    }
                    for k in kegiatan
                ],
            }
        )

    return users_dict


# @router.get("/kegiatan")
# def get_kegiatan(db: db_dependency, user: user_dependency):
#     if not user["is_admin"]:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
#         )

#     kegiatan = db.query(User).all().kegiatan
#     return kegiatan
