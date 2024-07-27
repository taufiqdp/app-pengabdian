from pydantic import BaseModel
from fastapi import APIRouter, status, UploadFile, HTTPException
from datetime import datetime

from api.models import Kegiatan
from api.dependencies import db_dependency, user_dependency

router = APIRouter(prefix="/kegiatan", tags=["kegiatan"])


class KegiatanCreateRequest(BaseModel):
    nama_kegiatan: str
    tanggal: datetime
    tempat: str
    deskripsi: str


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_kegiatan(
    kegiatan: KegiatanCreateRequest, db: db_dependency, user: user_dependency
):
    if user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot create kegiatan",
        )

    new_kegiatan = Kegiatan(
        nama_kegiatan=kegiatan.nama_kegiatan,
        tanggal=kegiatan.tanggal,
        tempat=kegiatan.tempat,
        deskripsi=kegiatan.deskripsi,
        user_id=user["id"],
    )
    db.add(new_kegiatan)
    db.commit()
    db.refresh(new_kegiatan)

    return new_kegiatan


@router.get("/")
def get_kegiatan(db: db_dependency, user: user_dependency):
    if not user["is_admin"]:
        kegiatan = db.query(Kegiatan).filter(Kegiatan.user_id == user["id"]).all()
        if len(kegiatan) < 1:
            return {"detail": "No kegiatan found"}
    else:
        kegiatan = db.query(Kegiatan).all()
    return kegiatan


@router.delete("/{kegiatan_id}")
def delete_kegiatan(kegiatan_id: int, db: db_dependency, user: user_dependency):
    kegiatan = db.query(Kegiatan).filter(Kegiatan.id == kegiatan_id).first()
    if not kegiatan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    if kegiatan.user_id != user["id"] and not user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this kegiatan",
        )

    db.delete(kegiatan)
    db.commit()

    return {"detail": "Kegiatan deleted"}
