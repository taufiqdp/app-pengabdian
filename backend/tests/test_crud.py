import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.dependencies import get_db
from main import app


@pytest.fixture(scope="function")
def db_session():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.fixture(scope="function")
def test_user():
    return {"username": "test", "password": "test"}


@pytest.fixture(scope="function")
def test_admin():
    return {"username": "admin", "password": "admin", "is_admin": True}


def test_create_pamong_as_admin(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Create pamong
    response = client.post(
        "pamong/",
        json={
            "nama": "Pamong 1",
            "nip": "1234567890",
            "jabatan": "Jabatan 1",
            "nik": "1234567890123456",
            "tempat_lahir": "Tempat 1",
            "tanggal_lahir": "2022-12-12",
            "alamat": "Alamat 1",
            "status_kawin": "Kawin",
            "pekerjaan": "Pekerjaan 1",
            "gol_darah": "A",
            "agama": "Islam",
            "jenis_kelamin": "L",
            "masa_jabatan_mulai": 2022,
            "masa_jabatan_selesai": 2023,
            "pendidikan_terakhir": "S1",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    print(response.json())
    assert response.status_code == 201


def test_create_and_login_user(client, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201
    assert response.json() == {"detail": "User created successfully"}

    # Login
    response = client.post("/auth/token", data=test_user)
    print(response.json())
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None


def test_create_user_duplicate(client, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201

    # Try to create the same user again
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already exists"}


def test_read_users_me(client, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Get user
    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"id": 1, "username": "test", "is_admin": False}


def test_create_and_login_admin(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201
    assert response.json() == {"detail": "Admin created successfully"}

    # Login
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None


def test_create_admin_duplicate(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Try to create the same admin again
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already exists"}


def test_create_kegiatan(client, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Create kegiatan
    response = client.post(
        "/kegiatan/",
        json={
            "nama_kegiatan": "Kegiatan 1",
            "tanggal": "2022-12-12",
            "tempat": "Tempat 1",
            "deskripsi": "Deskripsi 1",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "nama_kegiatan": "Kegiatan 1",
        "tanggal": "2022-12-12",
        "tempat": "Tempat 1",
        "deskripsi": "Deskripsi 1",
        "user_id": 1,
    }


def test_get_kegiatan(client, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Create kegiatan
    response = client.post(
        "/kegiatan/",
        json={
            "nama_kegiatan": "Kegiatan 1",
            "tanggal": "2022-12-12",
            "tempat": "Tempat 1",
            "deskripsi": "Deskripsi 1",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201

    # Get kegiatan
    response = client.get("/kegiatan/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "nama_kegiatan": "Kegiatan 1",
            "tanggal": "2022-12-12",
            "tempat": "Tempat 1",
            "deskripsi": "Deskripsi 1",
            "user_id": 1,
        }
    ]


def test_create_kegiatan_as_admin(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Try to create kegiatan as admin
    response = client.post(
        "/kegiatan/",
        json={
            "nama_kegiatan": "Kegiatan 1",
            "tanggal": "2022-12-12",
            "tempat": "Tempat 1",
            "deskripsi": "Deskripsi 1",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Admin cannot create kegiatan"}


def test_get_user_as_admin(client, test_admin):
    # Create 3 users
    for i in range(3):
        response = client.post(
            "/auth/users", json={"username": f"user{i}", "password": f"user{i}"}
        )
        assert response.status_code == 201
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Get user as admin
    response = client.get("/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_delete_user_as_admin(client, test_admin, test_user):
    # Create user
    response = client.post("/auth/users", json=test_user)
    assert response.status_code == 201

    # Get user id
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    token_user = response.json()["access_token"]
    assert token_user is not None

    user_id = client.get(
        "/users/me", headers={"Authorization": f"Bearer {token_user}"}
    ).json()["id"]
    assert user_id is not None

    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login as admin
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Delete user as admin
    response = client.delete(
        f"/admin/users/{user_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json() == {"detail": "User deleted"}
