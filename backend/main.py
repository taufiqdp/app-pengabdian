from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routers import auth, kegiatan, users, pamong, agenda
from app.internal import admin
from app.database import Base, engine

#
# from app.helper import helper


app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "last_updated": "2024-09-05T10:20:00"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(kegiatan.router)
app.include_router(admin.router)
app.include_router(pamong.router)
app.include_router(agenda.router)


# Delete later
# app.include_router(helper.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")