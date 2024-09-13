"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export default function InputPamong() {
  const [formData, setFormData] = useState({
    foto: null,
    nama: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    status_kawin: "Belum Kawin",
    pekerjaan: "",
    gol_darah: "A",
    jenis_kelamin: "L",
    agama: "Islam",
    nip: "",
    jabatan: "",
    masa_jabatan_mulai: "",
    masa_jabatan_selesai: "",
    pendidikan_terakhir: "",
  });

  const [previewUrl, setPreviewUrl] = useState("/img/undraw_profile.svg");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevState) => ({
        ...prevState,
        foto: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-2xl font-bold mb-4">Tambah Pamong</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader>Foto Profile</CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-full max-w-[250px] h-0 pb-[100%] relative overflow-hidden rounded-full mx-auto mb-2">
                  <img
                    src={previewUrl}
                    alt="Profile Picture"
                    className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  JPG atau PNG max. 5 MB
                </div>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>Pamong Detail</CardHeader>
            <CardContent>
              <h4 className="text-lg font-semibold mb-2">Data Diri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="NIK"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Tempat Lahir"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  required
                  className="col-span-2"
                />
                <select
                  name="status_kawin"
                  value={formData.status_kawin}
                  onChange={handleInputChange}
                  required
                  className="input-class" // Make sure to use appropriate styles
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
                <Input
                  placeholder="Pekerjaan"
                  name="pekerjaan"
                  value={formData.pekerjaan}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="gol_darah"
                  value={formData.gol_darah}
                  onChange={handleInputChange}
                  required
                  className="input-class"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleInputChange}
                  required
                  className="input-class"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                  required
                  className="input-class"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Budha">Budha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <h4 className="text-lg font-semibold mb-2">Data Pegawai</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="NIP"
                  name="nip"
                  value={formData.nip}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Jabatan"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="number"
                  placeholder="Masa Jabatan Mulai"
                  name="masa_jabatan_mulai"
                  value={formData.masa_jabatan_mulai}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="number"
                  placeholder="Masa Jabatan Selesai"
                  name="masa_jabatan_selesai"
                  value={formData.masa_jabatan_selesai}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Pendidikan Terakhir"
                  name="pendidikan_terakhir"
                  value={formData.pendidikan_terakhir}
                  onChange={handleInputChange}
                  required
                  className="col-span-2"
                />
              </div>

              <Button type="submit">Tambah Pamong</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
