from pydantic import BaseModel, Json
from fastapi import APIRouter, status, HTTPException, UploadFile, File
from datetime import datetime
from typing import Optional, Union
from dotenv import load_dotenv
import io
import os
import uuid

from app.models import Kegiatan
from app.dependencies import db_dependency, user_dependency
from app.utils.utils import upload_file_to_s3, delete_file_from_s3


router = APIRouter(prefix="/kegiatan", tags=["kegiatan"])

load_dotenv(override=True)
ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")


class KegiatanCreateRequest(BaseModel):
    nama_kegiatan: str
    tanggal: datetime
    tempat: str
    deskripsi: Optional[str] = None


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_kegiatan(
    kegiatan: Json[KegiatanCreateRequest],
    db: db_dependency,
    user: user_dependency,
    file: Union[UploadFile, str] = File(None),
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

    image_path = None

    if file:
        image = await file.read()
        image_path = f"kegiatan/{uuid.uuid4()}_{file.filename}"
        
        image_file = io.BytesIO(image)

        res = upload_file_to_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=image_path,
            object=image_file
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image",
            )
        
        new_kegiatan.gambar = f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{image_path}"

    db.add(new_kegiatan)
    db.commit()
    db.refresh(new_kegiatan)

    return {"detail": "Kegiatan created"}


@router.get("/")
async def get_kegiatan(db: db_dependency, user: user_dependency):
    if not user["is_admin"]:
        kegiatan = db.query(Kegiatan).filter(Kegiatan.user_id == user["id"]).all()
        if len(kegiatan) < 1:
            return {"detail": "No kegiatan found"}
    else:
        kegiatan = db.query(Kegiatan).all()

    return kegiatan


@router.get("/{kegiatan_id}")
async def get_kegiatan_by_id(
    kegiatan_id: int, db: db_dependency, user: user_dependency
):
    kegiatan = db.query(Kegiatan).filter(Kegiatan.id == kegiatan_id).first()
    if user["id"] != kegiatan.user_id and not user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to access this kegiatan",
        )

    if not kegiatan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    return kegiatan


@router.put("/{kegiatan_id}")
async def update_kegiatan(
    kegiatan_id: int,
    kegiatan: Json[KegiatanCreateRequest],
    db: db_dependency,
    user: user_dependency,
    file: Union[UploadFile, str] = File(None),
):
    kegiatan_data = db.query(Kegiatan).filter(Kegiatan.id == kegiatan_id).first()

    if not kegiatan_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    if kegiatan_data.user_id != user["id"] and not user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this kegiatan",
        )

    kegiatan_data.nama_kegiatan = kegiatan.nama_kegiatan
    kegiatan_data.tanggal = kegiatan.tanggal
    kegiatan_data.tempat = kegiatan.tempat
    kegiatan_data.deskripsi = kegiatan.deskripsi

    if file:
        if kegiatan_data.gambar:
            res = delete_file_from_s3(
                access_key_id=ACCESS_KEY_ID,
                secret_access_key=SECRET_ACCESS_KEY,
                bucket_name=BUCKET_NAME,
                object_key=f"kegiatan/{kegiatan_data.gambar.split('/')[-1]}",
            )

            if not res:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        image = await file.read()
        image_path = f"kegiatan/{uuid.uuid4()}_{file.filename}"
        
        image_file = io.BytesIO(image)

        res = upload_file_to_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=image_path,
            object=image_file
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image",
            )
        
        kegiatan_data.gambar = f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{image_path}"


    db.commit()
    db.refresh(kegiatan_data)

    return {"detail": "Kegiatan updated"}


@router.delete("/{kegiatan_id}")
async def delete_kegiatan(kegiatan_id: int, db: db_dependency, user: user_dependency):
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
    
    if kegiatan.gambar:
        res = delete_file_from_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=f"kegiatan/{kegiatan.gambar.split('/')[-1]}",
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    db.delete(kegiatan)
    db.commit()

    return {"detail": "Kegiatan deleted"}
