from fastapi import APIRouter, HTTPException, status, UploadFile, File
from pydantic import BaseModel, Json
from datetime import datetime
from enum import Enum
from typing import Optional, Union
from dotenv import load_dotenv
import io
import os
import uuid


from app.dependencies import db_dependency, admin_dependency, user_dependency
from app.models import Pamong, User
from app.utils.utils import upload_file_to_s3, delete_file_from_s3

router = APIRouter(prefix="/pamong", tags=["pamong"])

load_dotenv(override=True)
ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")


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


@router.post("/", status_code=201)
async def create_pamong(
    pamong: Json[PamongBase],
    db: db_dependency,
    file: Union[UploadFile, str] = File(None),
):
    if db.query(Pamong).filter(Pamong.nip == pamong.nip).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Pamong already exists"
        )

    image_path = None

    if file:
        image = await file.read()
        image_path = f"profile/{uuid.uuid4()}_{file.filename}"

        image_file = io.BytesIO(image)

        res = upload_file_to_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=image_path,
            object=image_file,
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image",
            )

    new_pamong = Pamong(
        **pamong.model_dump(),
        gambar=f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{image_path}" if file else None,
    )

    db.add(new_pamong)
    db.commit()
    db.refresh(new_pamong)

    return {"detail": "Pamong created"}


@router.get("/")
async def get_pamong(db: db_dependency, user: user_dependency):
    user_data = db.query(User).filter(User.id == user["id"]).first()
    if not user_data.pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user_data.pamong


@router.put("/")
async def update_pamong(
    user: user_dependency,
    pamong: Json[PamongBase],
    db: db_dependency,
    file: Union[UploadFile, str] = File(None),
):
    user_data = db.query(User).filter(User.id == user["id"]).first()

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    pamong_to_update = user_data.pamong

    if file:
        if pamong_to_update.gambar:
            res = delete_file_from_s3(
                access_key_id=ACCESS_KEY_ID,
                secret_access_key=SECRET_ACCESS_KEY,
                bucket_name=BUCKET_NAME,
                object_key=f"profile/{pamong_to_update.gambar.split('/')[-1]}",
            )

            if not res:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        image = await file.read()
        image_path = f"profile/{uuid.uuid4()}_{file.filename}"

        image_file = io.BytesIO(image)

        res = upload_file_to_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=image_path,
            object=image_file,
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image",
            )

        pamong_to_update.gambar = f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{image_path}"

    for key, value in pamong.model_dump(exclude_unset=True).items():
        setattr(pamong_to_update, key, value)

    db.commit()
    db.refresh(pamong_to_update)

    return {"detail": "Pamong updated"}
