from tests.conftest import test_user, test_admin, client, test_pamong


def test_create_kegiatan(client, test_user, test_admin, test_pamong):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/admin/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Create pamong
    response = client.post(
        "pamong/",
        json=test_pamong,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201

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


def test_get_kegiatan(client, test_user, test_admin, test_pamong):
        # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/admin/token", data=test_admin)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # Create pamong
    response = client.post(
        "pamong/",
        json=test_pamong,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201

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


def test_create_kegiatan_as_admin(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login
    response = client.post("/auth/admin/token", data=test_admin)
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
