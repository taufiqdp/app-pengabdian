"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import profileImage from "@/assets/dummy-profile.png";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import FormButton from "./form-button";

export default function PamongInputForm({
  pamongAction,
  defaultValues = null,
}) {
  const [state, formAction] = useFormState(pamongAction, defaultValues || {});
  const [imageSrc, setImageSrc] = useState(
    defaultValues?.gambar || profileImage
  );
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-2xl font-bold mb-4">
        {!defaultValues ? "Tambah Pamong" : "Edit Pamong"}
      </h1>

      <form action={formAction}>
        {defaultValues && (
          <input type="hidden" name="id" defaultValue={defaultValues.id} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="md:col-span-3 lg:col-span-1 order-1 md:order-1 lg:order-1">
            <Card className="shadow-md mb-4 pb-4 lg:mb-0 lg:pb-8">
              <CardHeader>Foto</CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 relative mx-auto mb-4">
                    <Image
                      src={imageSrc}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Maksimal ukuran 5 MB
                  </div>
                  <label
                    htmlFor="upload-foto"
                    className="cursor-pointer inline-block"
                  >
                    <span className="bg-lblue hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                      Unggah Foto
                    </span>
                    <input
                      id="upload-foto"
                      type="file"
                      accept="image/*"
                      name="image"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 lg:col-span-2 order-2 md:order-2 lg:order-2">
            <Card className="shadow-md">
              <CardHeader>Data Pribadi Pamong</CardHeader>
              <CardContent>
                <h4 className="text-lg font-semibold mb-2">Data Diri</h4>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="nama">Nama</Label>
                      <Input
                        id="nama"
                        placeholder="Nama"
                        name="nama"
                        defaultValue={defaultValues?.nama}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="nik">NIK</Label>
                      <Input
                        id="nik"
                        placeholder="NIK"
                        name="nik"
                        defaultValue={defaultValues?.nik}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                      <Input
                        id="tempat_lahir"
                        placeholder="Tempat Lahir"
                        name="tempat_lahir"
                        defaultValue={defaultValues?.tempat_lahir}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                      <Input
                        id="tanggal_lahir"
                        type="date"
                        name="tanggal_lahir"
                        defaultValue={defaultValues?.tanggal_lahir}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      placeholder="Alamat"
                      name="alamat"
                      defaultValue={defaultValues?.alamat}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="status_kawin">Status Perkawinan</Label>
                      <Select
                        name="status_kawin"
                        defaultValue={defaultValues?.status_kawin}
                        required
                      >
                        <SelectTrigger id="status_kawin">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Belum Kawin">
                            Belum Kawin
                          </SelectItem>
                          <SelectItem value="Kawin">Kawin</SelectItem>
                          <SelectItem value="Cerai Hidup">
                            Cerai Hidup
                          </SelectItem>
                          <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="pekerjaan">Pekerjaan</Label>
                      <Input
                        id="pekerjaan"
                        placeholder="Pekerjaan"
                        name="pekerjaan"
                        defaultValue={defaultValues?.pekerjaan}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gol_darah">Golongan Darah</Label>
                      <Select
                        name="gol_darah"
                        defaultValue={defaultValues?.gol_darah}
                        required
                      >
                        <SelectTrigger id="gol_darah">
                          <SelectValue placeholder="Pilih golongan darah" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                      <Select
                        name="jenis_kelamin"
                        defaultValue={defaultValues?.jenis_kelamin}
                        required
                      >
                        <SelectTrigger id="jenis_kelamin">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agama">Agama</Label>
                    <Select
                      name="agama"
                      defaultValue={defaultValues?.agama}
                      required
                    >
                      <SelectTrigger id="agama">
                        <SelectValue placeholder="Pilih agama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Budha">Budha</SelectItem>
                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mt-6 mb-2">
                  Data Pegawai
                </h4>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="jabatan">NIP</Label>
                      <Input
                        id="nip"
                        placeholder="NIP"
                        name="nip"
                        defaultValue={defaultValues?.nip}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="jabatan">Jabatan</Label>
                      <Input
                        id="jabatan"
                        placeholder="Jabatan"
                        name="jabatan"
                        defaultValue={defaultValues?.jabatan}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="masa_jabatan_mulai">
                        Masa Jabatan Mulai
                      </Label>
                      <Input
                        id="masa_jabatan_mulai"
                        type="number"
                        placeholder="Masa Jabatan Mulai"
                        name="masa_jabatan_mulai"
                        defaultValue={defaultValues?.masa_jabatan_mulai}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="masa_jabatan_selesai">
                        Masa Jabatan Selesai
                      </Label>
                      <Input
                        id="masa_jabatan_selesai"
                        type="number"
                        placeholder="Masa Jabatan Selesai"
                        name="masa_jabatan_selesai"
                        defaultValue={defaultValues?.masa_jabatan_selesai}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pendidikan_terakhir">
                      Pendidikan Terakhir
                    </Label>
                    <Input
                      id="pendidikan_terakhir"
                      placeholder="Pendidikan Terakhir"
                      name="pendidikan_terakhir"
                      defaultValue={defaultValues?.pendidikan_terakhir}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2 justify-end mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Batal
                  </Button>
                  {defaultValues ? (
                    <FormButton title="Simpan Perubahan" />
                  ) : (
                    <FormButton title="Simpan" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
