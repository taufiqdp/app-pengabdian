"use client";

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

export default function PamongInputForm({
  pamongAction,
  defaultValues = null,
}) {
  const [state, formAction] = useFormState(pamongAction, defaultValues || {});
  const router = useRouter();

  return (
    <div className="container-fluid">
      <h1 className="text-2xl font-bold mb-4">
        {!defaultValues ? "Tambah Pamong" : "Edit Pamong"}
      </h1>

      <form encType="multipart/form-data" action={formAction}>
        {defaultValues && (
          <input type="hidden" name="id" defaultValue={defaultValues.id} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader>Foto Profile</CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-full max-w-[250px] h-0 pb-[100%] relative overflow-hidden rounded-full mx-auto mb-2">
                  <Image
                    src={profileImage}
                    alt="Profile Picture"
                    className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  JPG atau PNG max. 5 MB
                </div>
                <Input type="file" accept="image/*" name="image" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>Pamong Detail</CardHeader>
            <CardContent>
              <h4 className="text-lg font-semibold mb-2">Data Diri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama</Label>
                  <Input
                    id="nama"
                    placeholder="Nama"
                    name="nama"
                    defaultValue={defaultValues?.nama}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input
                    id="nik"
                    placeholder="NIK"
                    name="nik"
                    defaultValue={defaultValues?.nik}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input
                    id="tempat_lahir"
                    placeholder="Tempat Lahir"
                    name="tempat_lahir"
                    defaultValue={defaultValues?.tempat_lahir}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    name="tanggal_lahir"
                    defaultValue={defaultValues?.tanggal_lahir}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    placeholder="Alamat"
                    name="alamat"
                    defaultValue={defaultValues?.alamat}
                    required
                  />
                </div>
                <div className="space-y-2">
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
                      <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                      <SelectItem value="Kawin">Kawin</SelectItem>
                      <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">Pekerjaan</Label>
                  <Input
                    id="pekerjaan"
                    placeholder="Pekerjaan"
                    name="pekerjaan"
                    defaultValue={defaultValues?.pekerjaan}
                    required
                  />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
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

              <h4 className="text-lg font-semibold mb-2">Data Pegawai</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    placeholder="NIP"
                    name="nip"
                    defaultValue={defaultValues?.nip}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input
                    id="jabatan"
                    placeholder="Jabatan"
                    name="jabatan"
                    defaultValue={defaultValues?.jabatan}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_jabatan_mulai">Masa Jabatan Mulai</Label>
                  <Input
                    id="masa_jabatan_mulai"
                    type="number"
                    placeholder="Masa Jabatan Mulai"
                    name="masa_jabatan_mulai"
                    defaultValue={defaultValues?.masa_jabatan_mulai}
                    required
                  />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2 col-span-2">
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
              <div className="flex space-x-2">
                {defaultValues ? (
                  <Button type="submit">Simpan</Button>
                ) : (
                  <Button type="submit">Tambah Pamong</Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
