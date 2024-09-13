const formData = new FormData();

// Create the JSON object for pamong
const pamongData = {
  jenis_kelamin: "P",
  gol_darah: "B",
  tempat_lahir: "aaaaa",
  pekerjaan: "aaaaaaa",
  nama: "aaaaaaa",
  tanggal_lahir: "2024-09-04",
  alamat: "aaa",
  jabatan: "aaaa",
  agama: "Katolik",
  nik: "2342342323423442",
  pendidikan_terakhir: "sq",
  nip: "234234657567234",
  status_kawin: "Cerai Mati",
  masa_jabatan_mulai: 3123,
  masa_jabatan_selesai: 2312,
};

// Append the pamong data as a stringified JSON object
formData.append("pamong", JSON.stringify(pamongData));

// If you have a file to upload, append it here
// formData.append("file", fileInput.files[0]);

// Make the POST request using fetch
fetch("http://127.0.0.1:8000/pamong/", {
  method: "POST",
  headers: {
    // 'accept': 'application/json' is automatically added by fetch for multipart/form-data
    // No need to explicitly set it
  },
  body: formData,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse the JSON response if needed
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
