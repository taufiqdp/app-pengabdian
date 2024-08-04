from tests.conftest import test_admin, client, test_user, test_pamong


def test_create_pamong_(client, test_admin, test_pamong):
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


def test_get_pamong(client, test_admin, test_user, test_pamong):
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

    # Get pamong
    response = client.get(
        "pamong/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200


def test_update_pamong(client, test_admin, test_user, test_pamong):
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

    # Update pamong
    test_pamong.update({"nama": "David Hoop"})
    response = client.put(
        "pamong/",
        json=test_pamong,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
