from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from app.dependencies import db_dependency, admin_dependency
from app.models import Agenda


router = APIRouter(prefix="/agenda", tags=["agenda"])


class AgendaBase(BaseModel):
    nama_agenda: str
    tanggal_mulai: datetime
    tanggal_selesai: datetime
    tempat: str
    deskripsi: Optional[str] = None


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_agenda(agenda: AgendaBase, db: db_dependency, admin: admin_dependency):
    new_agenda = Agenda(**agenda.model_dump())

    db.add(new_agenda)
    db.commit()
    db.refresh(new_agenda)

    return new_agenda


@router.get("/")
def get_agenda(db: db_dependency):
    return db.query(Agenda).all()


@router.get("/{agenda_id}")
def get_agenda_by_id(agenda_id: int, db: db_dependency):
    agenda = db.query(Agenda).filter(Agenda.id == agenda_id).first()

    if not agenda:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Agenda not found")

    return agenda


@router.put("/{agenda_id}")
def update_agenda(
    agenda_id: int, agenda: AgendaBase, db: db_dependency, admin: admin_dependency
):
    agenda_data = db.query(Agenda).filter(Agenda.id == agenda_id).first()

    if not agenda_data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Agenda not found")

    for key, value in agenda.model_dump().items():
        setattr(agenda_data, key, value)

    db.commit()
    db.refresh(agenda_data)

    return agenda_data


@router.delete("/{agenda_id}")
def delete_agenda(agenda_id: int, db: db_dependency, admin: admin_dependency):
    agenda_data = db.query(Agenda).filter(Agenda.id == agenda_id).first()

    if not agenda_data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Agenda not found")

    db.delete(agenda_data)
    db.commit()

    return {"detail": "Agenda deleted"}
