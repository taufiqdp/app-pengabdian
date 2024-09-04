from tests.conftest import client, test_admin, test_agenda


# Helper function to create and login admin
def create_and_login_admin(client, test_admin):
    client.post("/auth/admin", json=test_admin)
    response = client.post("/auth/admin/token", data=test_admin)
    assert response.status_code == 200

    return response.json()["access_token"]


# Helper function to create a agenda
def create_agenda(client, test_agenda, test_admin):
    token = create_and_login_admin(client, test_admin)

    response = client.post(
        "/agenda/",
        json=test_agenda,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    return response.json()


def test_get_agenda(client, test_agenda, test_admin):
    create_agenda(client, test_agenda, test_admin)

    response = client.get("/agenda/")
    assert response.status_code == 200


def test_get_agenda_by_id(client, test_agenda, test_admin):
    id_agenda = create_agenda(client, test_agenda, test_admin)["id"]
    response = client.get(f"/agenda/{id_agenda}")
    assert response.status_code == 200


def test_update_agenda(client, test_agenda, test_admin):
    id_agenda = create_agenda(client, test_agenda, test_admin)["id"]
    test_agenda.update({"nama_agenda": "agenda 2"})

    token = create_and_login_admin(client, test_admin)
    response = client.put(
        f"/agenda/{id_agenda}",
        json=test_agenda,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200


def test_delete_agenda(client, test_agenda, test_admin):
    id_agenda = create_agenda(client, test_agenda, test_admin)["id"]
    token = create_and_login_admin(client, test_admin)

    response = client.delete(
        f"/agenda/{id_agenda}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
