from tests.conftest import client, test_user, test_admin, test_pamong


def test_create_and_login_user(client, test_user, test_admin, test_pamong):
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


def test_login_user_with_nip(client, test_user, test_admin, test_pamong):
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

    # Login with NIP
    response = client.post("/auth/token", data={"username": test_user["nip"], "password": "test"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None


def test_read_users_me(client, test_user, test_admin, test_pamong):
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

    # Get user
    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


def test_create_and_login_admin(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201
    assert response.json() == {"detail": "Admin created successfully"}

    # Login
    response = client.post("/auth/admin/token", data=test_admin)
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


def test_login_admin_in_mobile(client, test_admin):
    # Create admin
    response = client.post("/auth/admin", json=test_admin)
    assert response.status_code == 201

    # Login as admin in mobile
    response = client.post("/auth/token", data=test_admin)
    assert response.status_code == 401


def test_login_user_in_admin(client, test_user, test_admin, test_pamong):
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

    # Login as user in admin
    response = client.post("/auth/admin/token", data=test_user)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized access"}


def test_forget_password(client, test_user, test_admin, test_pamong):
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

    # Forget password
    response = client.post("/auth/forget-password", json={"email": test_user["email"]})
    reset_password_token = response.json()["reset_password_token"]
    assert response.status_code == 200

    # Reset password
    response = client.post(
        "/auth/reset-password",
        json={
            "token": reset_password_token,
            "new_password": "new",
        },
    )
    assert response.status_code == 200
