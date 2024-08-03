from tests.conftest import test_admin, client, test_user


def test_create_pamong_(client, test_admin):
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
        json={
            "nama": "David Lee",
            "nik": "3216012304891238",
            "nip": "198703212011011005",
            "tempat_lahir": "Medan",
            "tanggal_lahir": "1987-03-21T06:54:18.299Z",
            "alamat": "Jl. Sisingamangaraja No. 101, Medan",
            "status_kawin": "Kawin",
            "pekerjaan": "PNS",
            "jabatan": "Kepala Sub Bagian",
            "gol_darah": "A",
            "agama": "Hindu",
            "jenis_kelamin": "L",
            "masa_jabatan_mulai": 2017,
            "masa_jabatan_selesai": 2022,
            "pendidikan_terakhir": "S1 Teknik Sipil",
            "image": "david-lee.jpg",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
