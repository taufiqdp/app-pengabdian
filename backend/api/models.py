from sqlalchemy import Column, Integer, String, ForeignKey, Table, Date
from sqlalchemy.orm import relationship
from api.database import Base


# kegiatan_pamong = Table(
#     "kegiatan_pamong",
#     Base.metadata,
#     Column("pamong_id", Integer, ForeignKey("pamong.id")),
#     Column("kegiatan_id", Integer, ForeignKey("kegiatan.id")),
# )


# class Pamong(Base):
#     __tablename__ = "pamong"

#     id = Column(Integer, primary_key=True, index=True)
#     nama = Column(String)
#     nik = Column(String)
#     nip = Column(String)
#     tempat_lahir = Column(String)
#     tanggal_lahir = Column(Date)
#     alamat = Column(String)
#     status_kawin = Column(String)
#     jabatan = Column(String)
#     unit_kerja = Column(String)
#     golongan_darah = Column(String)
#     agama = Column(String)
#     jenis_kelamin = Column(String)
#     mulai_jabatan = Column(Date)
#     akhir_jabatan = Column(Date)
#     pendidikan_terakhir = Column(String)

#     # Menambahkan relasi ke Kegiatan
#     kegiatan = relationship(
#         "Kegiatan", secondary=kegiatan_pamong, back_populates="pamong"
#     )


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    password = Column(String)


class Kegiatan(Base):
    __tablename__ = "kegiatan"

    id = Column(Integer, primary_key=True, index=True)
    nama_kegiatan = Column(String)
    tanggal = Column(Date)
    tempat = Column(String)
    deskripsi = Column(String)

    user_id = Column(Integer, ForeignKey("user.id"))
