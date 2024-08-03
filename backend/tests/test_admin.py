from tests.conftest import client, test_admin, test_user, test_pamong


def test_get_user_as_admin(client, test_admin, test_user, test_pamong):
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

    # Get user as admin
    response = client.get("/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_delete_user_as_admin(client, test_admin, test_user, test_pamong):
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

    # Get user id
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    token_user = response.json()["access_token"]
    assert token_user is not None

    user_id = client.get(
        "/users/me", headers={"Authorization": f"Bearer {token_user}"}
    ).json()["id"]
    assert user_id is not None

    # Delete user as admin
    response = client.delete(
        f"/admin/users/{user_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json() == {"detail": "User deleted"}
