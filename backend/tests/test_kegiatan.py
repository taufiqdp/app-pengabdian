import json
import os

from tests.conftest import test_user, test_admin, client, test_pamong, test_kegiatan


# Helper function to create and login admin
def create_and_login_admin(client, test_admin):
    client.post("/auth/admin", json=test_admin)
    response = client.post("/auth/admin/token", data=test_admin)
    assert response.status_code == 200
    return response.json()["access_token"]


# Helper function to create a user and login
def create_and_login_user(client, test_user, test_admin, test_pamong):
    admin_token = create_and_login_admin(client, test_admin)
    create_pamong(client, test_pamong, admin_token)
    client.post("/auth/users", json=test_user)
    response = client.post("/auth/token", data=test_user)
    assert response.status_code == 200
    return response.json()["access_token"]


# Helper function to create a pamong
def create_pamong(client, test_pamong, token):
    response = client.post(
        "pamong/",
        data={"pamong": json.dumps(test_pamong)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201


# Helper function to create a kegiatan
def create_kegiatan(client, token, test_kegiatan):
    response = client.post(
        "kegiatan/",
        data={"kegiatan": json.dumps(test_kegiatan)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201


def test_create_kegiatan(client, test_user, test_admin, test_pamong, test_kegiatan):
    user_token = create_and_login_user(client, test_user, test_admin, test_pamong)
    create_kegiatan(client, user_token, test_kegiatan)


def test_get_kegiatan(client, test_user, test_admin, test_pamong, test_kegiatan):
    user_token = create_and_login_user(client, test_user, test_admin, test_pamong)
    create_kegiatan(client, user_token, test_kegiatan)
    response = client.get(
        "/kegiatan/", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200


def test_get_kegiatan_by_id(client, test_user, test_admin, test_pamong, test_kegiatan):
    user_token = create_and_login_user(client, test_user, test_admin, test_pamong)
    create_kegiatan(client, user_token, test_kegiatan)

    # get kegiatan id
    response = client.get(
        "/kegiatan/", headers={"Authorization": f"Bearer {user_token}"}
    )

    kegiatan_id = response.json()[0]["id"]
    response = client.get(
        f"/kegiatan/{kegiatan_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200


def test_update_kegiatan(client, test_user, test_admin, test_pamong, test_kegiatan):
    user_token = create_and_login_user(client, test_user, test_admin, test_pamong)
    create_kegiatan(client, user_token, test_kegiatan)

    # get kegiatan id
    response = client.get(
        "/kegiatan/", headers={"Authorization": f"Bearer {user_token}"}
    )

    kegiatan_id = response.json()[0]["id"]
    test_kegiatan.update({"nama_kegiatan": "Holaaaaa"})

    path = "app/uploads/"
    with open(f"{path}0.jpg", "rb") as image:
        response = client.put(
            f"/kegiatan/{kegiatan_id}",
            data={"kegiatan": json.dumps(test_kegiatan)},
            files={"file": ("test.jpg", image, "image/jpeg")},
            headers={"Authorization": f"Bearer {user_token}"},
        )

    assert response.status_code == 200
    os.remove(f"{path}test.jpg")


def test_delete_kegiatan(client, test_user, test_admin, test_pamong, test_kegiatan):
    user_token = create_and_login_user(client, test_user, test_admin, test_pamong)
    create_kegiatan(client, user_token, test_kegiatan)

    # get kegiatan id
    response = client.get(
        "/kegiatan/", headers={"Authorization": f"Bearer {user_token}"}
    )

    kegiatan_id = response.json()[0]["id"]
    response = client.delete(
        f"/kegiatan/{kegiatan_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
