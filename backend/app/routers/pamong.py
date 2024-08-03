from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Optional


from app.dependencies import db_dependency, admin_dependency, user_dependency
from app.models import Pamong

router = APIRouter(prefix="/pamong", tags=["pamong"])


class StatusKawinEnum(str, Enum):
    Belum_Kawin = "Belum Kawin"
    Kawin = "Kawin"
    Cerai_Hidup = "Cerai Hidup"
    Cerai_Mati = "Cerai Mati"


class GologanDarahEnum(str, Enum):
    A = "A"
    B = "B"
    AB = "AB"
    O = "O"


class AgamaEnum(str, Enum):
    Islam = "Islam"
    Kristen = "Kristen"
    Katolik = "Katolik"
    Hindu = "Hindu"
    Budha = "Budha"
    Konghucu = "Konghucu"


class JenisKelaminEnum(str, Enum):
    L = "L"
    P = "P"


class PamongBase(BaseModel):
    nama: str
    nik: str
    nip: str
    tempat_lahir: str
    tanggal_lahir: datetime
    alamat: str
    status_kawin: StatusKawinEnum
    pekerjaan: str
    jabatan: str
    gol_darah: GologanDarahEnum
    agama: AgamaEnum
    jenis_kelamin: JenisKelaminEnum
    masa_jabatan_mulai: int
    masa_jabatan_selesai: int
    pendidikan_terakhir: str
    gambar: Optional[str] = None


@router.post("/", status_code=201)
async def create_pamong(pamong: PamongBase, db: db_dependency):
    if db.query(Pamong).filter(Pamong.nip == pamong.nip).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Pamong already exists"
        )

    if pamong.gambar:
        gambar_path = "assets/uploads"
        pamong.gambar = f"{gambar_path}/{pamong.gambar}"

    new_pamong = Pamong(**pamong.model_dump())
    db.add(new_pamong)
    db.commit()
    db.refresh(new_pamong)

    return new_pamong


@router.get("/")
async def get_pamong(db: db_dependency, user: user_dependency):
    pamong = db.query(Pamong).filter(Pamong.user_id == user["id"]).first()
    if not pamong:
        return {"detail": "No pamong found"}

    return pamong
