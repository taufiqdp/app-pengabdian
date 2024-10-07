from fastapi import APIRouter, HTTPException, status, UploadFile, File
from datetime import date
from typing import Union, Optional
from pydantic import Json
from dotenv import load_dotenv
from openpyxl import Workbook
from typing import List
from datetime import datetime
import os
import io
import uuid

from app.models import User, Kegiatan, Pamong, Agenda
from app.dependencies import db_dependency, admin_dependency
from app.routers.pamong import PamongBase
from app.utils.utils import upload_file_to_s3, delete_file_from_s3


router = APIRouter(prefix="/admin", tags=["admin"])

load_dotenv(override=True)
ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")


@router.get("/users")
async def get_users(db: db_dependency, admin: admin_dependency):
    users = db.query(User).filter(User.is_admin == False).all()
    users_with_pamong = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "nama_pamong": user.pamong.nama if user.pamong else None,
            "id_pamong": user.pamong.id if user.pamong else None,
        }
        for user in users
    ]
    return users_with_pamong


@router.get("/users/{user_id}")
async def get_user_by_id(user_id: int, db: db_dependency, admin: admin_dependency):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "nama_pamong": user.pamong.nama if user.pamong else None,
    }

    return user_data


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: db_dependency, admin: admin_dependency):
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
async def get_pamong(db: db_dependency, admin: admin_dependency):
    pamong = db.query(Pamong).all()
    if not pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    return pamong


@router.get("/pamong/{pamong_id}")
async def get_pamong_by_id(pamong_id: int, db: db_dependency, admin: admin_dependency):
    pamong = db.query(Pamong).filter(Pamong.id == pamong_id).first()

    if not pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    return pamong


@router.put("/pamong/{pamong_id}")
async def update_pamong(
    pamong_id: int,
    pamong: Json[PamongBase],
    db: db_dependency,
    admin: admin_dependency,
    file: Union[UploadFile, str] = File(None),
):
    pamong_data = db.query(Pamong).filter(Pamong.id == pamong_id).first()

    if not pamong_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    if file:
        if pamong_data.gambar:
            res = delete_file_from_s3(
                access_key_id=ACCESS_KEY_ID,
                secret_access_key=SECRET_ACCESS_KEY,
                bucket_name=BUCKET_NAME,
                object_key=f"profile/{pamong_data.gambar.split('/')[-1]}",
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

        pamong_data.gambar = f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{image_path}"

    for key, value in pamong.model_dump(exclude_unset=True).items():
        setattr(pamong_data, key, value)

    db.commit()
    db.refresh(pamong_data)

    return {"detail": "Pamong updated"}


@router.delete("/pamong/{pamong_id}")
async def delete_pamong(db: db_dependency, pamong_id: int, admin: admin_dependency):
    pamong = db.query(Pamong).filter(Pamong.id == pamong_id).first()

    if pamong.gambar:
        res = delete_file_from_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=f"profile/{pamong.gambar.split('/')[-1]}",
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if not pamong:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pamong not found"
        )

    db.delete(pamong)
    db.commit()

    return {"detail": "Pamong deleted"}


@router.get("/kegiatan")
async def get_kegiatan(
    db: db_dependency,
    start_date: date,
    end_date: date,
    admin: admin_dependency,
    name_kegiatan: Optional[str] = None,
):
    if name_kegiatan:
        kegiatan_all = (
            db.query(Kegiatan)
            .filter(Kegiatan.tanggal >= start_date)
            .filter(Kegiatan.tanggal <= end_date)
            .filter(Kegiatan.nama_kegiatan == name_kegiatan)
            .all()
        )

    else:
        kegiatan_all = (
            db.query(Kegiatan)
            .filter(Kegiatan.tanggal >= start_date)
            .filter(Kegiatan.tanggal <= end_date)
            .all()
        )

    if not kegiatan_all:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    kegiatan_dict = [
        {
            "id": kegiatan.id,
            "nama_kegiatan": kegiatan.nama_kegiatan,
            "tanggal": kegiatan.tanggal,
            "tempat": kegiatan.tempat,
            "deskripsi": kegiatan.deskripsi,
            "gambar": kegiatan.gambar,
            "user_id": kegiatan.user_id,
            "nama_pamong": kegiatan.user.pamong.nama,
            "pamong_id": kegiatan.user.pamong.id,
        }
        for kegiatan in kegiatan_all
    ]

    return kegiatan_dict


@router.get("/kegiatan/export")
async def export_kegiatan_to_excel(
    db: db_dependency,
    start_date: date,
    end_date: date,
    admin: admin_dependency,
    name_kegiatan: Optional[str] = None,
):

    if name_kegiatan:
        kegiatan_all = (
            db.query(Kegiatan)
            .filter(Kegiatan.tanggal >= start_date)
            .filter(Kegiatan.tanggal <= end_date)
            .filter(Kegiatan.nama_kegiatan == name_kegiatan)
            .all()
        )

    else:
        kegiatan_all = (
            db.query(Kegiatan)
            .filter(Kegiatan.tanggal >= start_date)
            .filter(Kegiatan.tanggal <= end_date)
            .all()
        )

    if not kegiatan_all:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    wb = Workbook()
    ws = wb.active
    ws.title = "Kegiatan"

    headers = [
        "ID",
        "Nama Kegiatan",
        "Tanggal",
        "Tempat",
        "Deskripsi",
        "Gambar",
        "Nama Pamong",
        "NIP",
    ]
    ws.append(headers)

    for kegiatan in kegiatan_all:
        ws.append(
            [
                kegiatan.id,
                kegiatan.nama_kegiatan,
                kegiatan.tanggal,
                kegiatan.tempat,
                kegiatan.deskripsi,
                kegiatan.gambar,
                kegiatan.user.pamong.nama,
                kegiatan.user.pamong.nip,
            ]
        )

    # Save the workbook to an in-memory buffer
    with io.BytesIO() as buffer:
        wb.save(buffer)
        buffer.seek(0)  # Reset the buffer position to the beginning

        # Upload the buffer to S3
        file_key = f"exports/kegiatan_{start_date}_to_{end_date}.xlsx"
        res = upload_file_to_s3(
            access_key_id=ACCESS_KEY_ID,
            secret_access_key=SECRET_ACCESS_KEY,
            bucket_name=BUCKET_NAME,
            object_key=file_key,
            object=buffer,
        )

        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload file to S3",
            )

    return {"file_url": f"{S3_ENDPOINT_URL}/{BUCKET_NAME}/{file_key}"}


@router.get("/kegiatan/{kegiatan_id}")
async def get_kegiatan_by_id(
    kegiatan_id: int, db: db_dependency, admin: admin_dependency
):
    kegiatan = db.query(Kegiatan).filter(Kegiatan.id == kegiatan_id).first()

    if not kegiatan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    kegiatan = {
        "id": kegiatan.id,
        "nama_kegiatan": kegiatan.nama_kegiatan,
        "tanggal": kegiatan.tanggal,
        "tempat": kegiatan.tempat,
        "deskripsi": kegiatan.deskripsi,
        "gambar": kegiatan.gambar,
        "user_id": kegiatan.user_id,
        "nama_pamong": kegiatan.user.pamong.nama,
        "pamong_id": kegiatan.user.pamong.id,
    }

    return kegiatan


@router.get("/pamong/{pamong_id}/kegiatan")
async def get_kegiatan_by_pamong_id(
    pamong_id: int, db: db_dependency, admin: admin_dependency
):
    kegiatan_all = (
        db.query(Kegiatan).filter(Kegiatan.user.has(pamong_id=pamong_id)).all()
    )

    if not kegiatan_all:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Kegiatan not found"
        )

    kegiatan_dict = [
        {
            "id": kegiatan.id,
            "nama_kegiatan": kegiatan.nama_kegiatan,
            "tanggal": kegiatan.tanggal,
            "tempat": kegiatan.tempat,
            "deskripsi": kegiatan.deskripsi,
            "gambar": kegiatan.gambar,
            "user_id": kegiatan.user_id,
            "nama_pamong": kegiatan.user.pamong.nama,
            "pamong_id": kegiatan.user.pamong.id,
        }
        for kegiatan in kegiatan_all
    ]

    return kegiatan_dict


@router.get("/agenda/upcoming")
def get_upcoming_agenda(db: db_dependency, admin: admin_dependency):
    upcoming_agenda = (
        db.query(Agenda).filter(Agenda.tanggal_mulai >= datetime.now()).all()
    )

    return upcoming_agenda
