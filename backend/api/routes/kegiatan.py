from pydantic import BaseModel
from fastapi import APIRouter, status, UploadFile
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
    kegiatan = db.query(Kegiatan).filter(Kegiatan.user_id == user["id"]).all()
    if len(kegiatan) < 1:
        return {"message": "No kegiatan found"}

    return kegiatan
