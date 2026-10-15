/* ==================================================
   PLAYZONE - ADMIN
   ================================================== */


/* =========================
   AKUN ADMIN DEMO
========================= */

var ADMIN_USERNAME = "admin";
var ADMIN_PASSWORD = "admin123";


/* =========================
   HARGA KONSOL
========================= */

var HARGA_KONSOL = {
    "PS4": 10000,
    "PS5": 15000
};


/* =========================
   ELEMENT HTML
========================= */

var loginAdmin =
    document.getElementById("loginAdmin");

var dashboardAdmin =
    document.getElementById("dashboardAdmin");

var formAdmin =
    document.getElementById("formAdmin");

var username =
    document.getElementById("username");

var password =
    document.getElementById("password");

var pesanLogin =
    document.getElementById("pesanLogin");

var btnLogout =
    document.getElementById("btnLogout");


var tabelPenyewa =
    document.getElementById("tabelPenyewa");

var dataKosong =
    document.getElementById("dataKosong");

var searchInput =
    document.getElementById("searchInput");

var filterStatus =
    document.getElementById("filterStatus");


var totalPenyewa =
    document.getElementById("totalPenyewa");

var totalPesanan =
    document.getElementById("totalPesanan");

var totalUang =
    document.getElementById("totalUang");

var belumLunas =
    document.getElementById("belumLunas");

var jumlahData =
    document.getElementById("jumlahData");


/* =========================
   MODAL
========================= */

var modal =
    document.getElementById("modal");

var btnTambah =
    document.getElementById("btnTambah");

var btnTutupModal =
    document.getElementById("btnTutupModal");

var btnBatal =
    document.getElementById("btnBatal");

var formPenyewa =
    document.getElementById("formPenyewa");

var judulModal =
    document.getElementById("judulModal");


/* =========================
   FORM PENYEWA
========================= */

var indexEdit =
    document.getElementById("indexEdit");

var namaPenyewa =
    document.getElementById("namaPenyewa");

var hpPenyewa =
    document.getElementById("hpPenyewa");

var konsolPenyewa =
    document.getElementById("konsolPenyewa");

var lamaPenyewa =
    document.getElementById("lamaPenyewa");

var tanggalPenyewa =
    document.getElementById("tanggalPenyewa");

var waktuPenyewa =
    document.getElementById("waktuPenyewa");

var metodePenyewa =
    document.getElementById("metodePenyewa");

var statusPenyewa =
    document.getElementById("statusPenyewa");

var totalPenyewaInput =
    document.getElementById("totalPenyewa");

var pengambilanPenyewa =
    document.getElementById("pengambilanPenyewa");


/* ==================================================
   FORMAT RUPIAH
================================================== */

function rupiah(angka) {

    return "Rp" +
        Number(angka || 0).toLocaleString("id-ID");

}


/* ==================================================
   HITUNG TOTAL SEWA
================================================== */

function hitungTotal(konsol, lama) {

    var harga =
        Number(HARGA_KONSOL[konsol] || 0);

    var jumlahJam =
        Number(lama || 0);

    return harga * jumlahJam;

}


/* ==================================================
   UPDATE TOTAL PADA FORM
================================================== */

function updateTotalForm() {

    var konsol =
        konsolPenyewa.value;

    var lama =
        Number(lamaPenyewa.value || 0);

    var total =
        hitungTotal(konsol, lama);

    /*
       Masukkan hasil perhitungan
       ke input total.
    */

    if (totalPenyewaInput) {

        totalPenyewaInput.value =
            total;

    }

}


/* ==================================================
   FORMAT TANGGAL
================================================== */

function formatTanggal(tanggal) {

    if (!tanggal) {
        return "-";
    }

    var bagian =
        tanggal.split("-");

    if (bagian.length !== 3) {
        return tanggal;
    }

    return (
        bagian[2] +
        "/" +
        bagian[1] +
        "/" +
        bagian[0]
    );

}


/* ==================================================
   MENDAPATKAN HARI
================================================== */

function dapatkanHari(tanggal) {

    var hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    var date =
        new Date(tanggal + "T00:00:00");

    return hari[date.getDay()];

}


/* ==================================================
   BACA DATA RIWAYAT
================================================== */

function bacaData() {

    try {

        var data =
            JSON.parse(
                localStorage.getItem(
                    "playzone_riwayat"
                )
            );

        if (Array.isArray(data)) {

            return data;

        }

    } catch (error) {

        console.log(error);

    }

    return [];

}


/* ==================================================
   PERBAIKI DATA LAMA
   Jika data lama memiliki total 0,
   hitung ulang berdasarkan konsol dan lama.
================================================== */

function perbaikiTotalData(data) {

    var adaPerubahan = false;

    data.forEach(function (item) {

        var totalBaru =
            hitungTotal(
                item.konsol,
                item.lama
            );

        /*
           Jika total lama kosong atau 0,
           otomatis dihitung ulang.
        */

        if (
            !item.total ||
            Number(item.total) === 0
        ) {

            if (totalBaru > 0) {

                item.total =
                    totalBaru;

                adaPerubahan = true;

            }

        }

    });

    if (adaPerubahan) {

        simpanData(data);

    }

    return data;

}


/* ==================================================
   SIMPAN DATA
================================================== */

function simpanData(data) {

    localStorage.setItem(
        "playzone_riwayat",
        JSON.stringify(data)
    );

}


/* ==================================================
   LOGIN ADMIN
================================================== */

formAdmin.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        var user =
            username.value.trim();

        var pass =
            password.value;

        if (
            user === ADMIN_USERNAME &&
            pass === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem(
                "playzone_admin_login",
                "true"
            );

            loginAdmin.hidden = true;

            dashboardAdmin.hidden = false;

            tampilkanData();

        } else {

            pesanLogin.textContent =
                "Username atau password salah.";

        }

    }
);


/* ==================================================
   CEK LOGIN SAAT HALAMAN DIBUKA
================================================== */

function cekLogin() {

    var login =
        sessionStorage.getItem(
            "playzone_admin_login"
        );

    if (login === "true") {

        loginAdmin.hidden = true;

        dashboardAdmin.hidden = false;

        tampilkanData();

    }

}


/* ==================================================
   LOGOUT
================================================== */

btnLogout.addEventListener(
    "click",
    function () {

        sessionStorage.removeItem(
            "playzone_admin_login"
        );

        dashboardAdmin.hidden = true;

        loginAdmin.hidden = false;

        username.value = "";

        password.value = "";

        pesanLogin.textContent = "";

    }
);


/* ==================================================
   TAMPILKAN DATA
================================================== */

function tampilkanData() {

    /*
       Ambil data dari localStorage
    */

    var semuaData =
        bacaData();


    /*
       Perbaiki data lama yang
       totalnya masih 0.
    */

    semuaData =
        perbaikiTotalData(
            semuaData
        );


    var keyword =
        searchInput.value
            .toLowerCase()
            .trim();

    var status =
        filterStatus.value;


    var hasil =
        semuaData.filter(
            function (data) {

                var nama =
                    String(
                        data.nama || ""
                    ).toLowerCase();

                var hp =
                    String(
                        data.hp || ""
                    ).toLowerCase();

                var cocokKeyword =
                    nama.includes(keyword) ||
                    hp.includes(keyword);


                var cocokStatus =
                    status === "semua" ||
                    data.statusPembayaran === status;


                return (
                    cocokKeyword &&
                    cocokStatus
                );

            }
        );


    tabelPenyewa.innerHTML = "";


    jumlahData.textContent =
        hasil.length + " data";


    if (hasil.length === 0) {

        dataKosong.hidden = false;

    } else {

        dataKosong.hidden = true;

    }


    hasil.forEach(
        function (data, index) {

            var baris =
                document.createElement("tr");


            var indexAsli =
                semuaData.indexOf(data);


            var kelasStatus =
                "status-belum";


            if (
                data.statusPembayaran ===
                "Lunas"
            ) {

                kelasStatus =
                    "status-lunas";

            } else if (
                data.statusPembayaran ===
                "Menunggu pembayaran"
            ) {

                kelasStatus =
                    "status-menunggu";

            }


            /*
               Pastikan total selalu berupa angka.
            */

            var total =
                Number(data.total || 0);


            /*
               Kalau total masih 0,
               coba hitung ulang.
            */

            if (total === 0) {

                total =
                    hitungTotal(
                        data.konsol,
                        data.lama
                    );

            }


            baris.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${data.nama || "-"}
                    </strong>
                </td>

                <td>
                    ${data.hp || "-"}
                </td>

                <td>
                    ${data.konsol || "-"}
                </td>

                <td>
                    ${formatTanggal(
                        data.tanggal
                    )}
                </td>

                <td>
                    ${data.waktu || "-"}
                </td>

                <td>
                    ${data.lama || 0} jam
                </td>

                <td class="harga">
                    ${rupiah(total)}
                </td>

                <td>

                    <span class="
                        status
                        ${kelasStatus}
                    ">

                        ${
                            data.statusPembayaran ||
                            "Belum Dibayar"
                        }

                    </span>

                </td>

                <td>

                    <div class="aksi">

                        <button
                            class="btn-edit"
                            onclick="editPenyewa(${indexAsli})"
                        >
                            Edit
                        </button>

                        <button
                            class="btn-hapus"
                            onclick="hapusPenyewa(${indexAsli})"
                        >
                            Hapus
                        </button>

                    </div>

                </td>

            `;


            tabelPenyewa.appendChild(
                baris
            );

        }
    );


    hitungStatistik(
        semuaData
    );

}


/* ==================================================
   STATISTIK
================================================== */

function hitungStatistik(data) {

    totalPesanan.textContent =
        data.length;


    /*
       Setiap data = satu pesanan.
       Untuk total penyewa unik,
       kita gunakan nama + nomor HP.
    */

    var penyewaUnik = [];


    data.forEach(
        function (item) {

            var nama =
                String(
                    item.nama || ""
                ).toLowerCase().trim();

            var hp =
                String(
                    item.hp || ""
                ).trim();

            var kunci =
                nama +
                "|" +
                hp;


            if (
                !penyewaUnik.includes(kunci)
            ) {

                penyewaUnik.push(kunci);

            }

        }
    );


    totalPenyewa.textContent =
        penyewaUnik.length;


    /*
       Hitung total seluruh uang.
    */

    var total =
        data.reduce(
            function (jumlah, item) {

                var nilaiTotal =
                    Number(
                        item.total || 0
                    );


                /*
                   Kalau total belum ada,
                   hitung berdasarkan konsol
                   dan lama sewa.
                */

                if (nilaiTotal === 0) {

                    nilaiTotal =
                        hitungTotal(
                            item.konsol,
                            item.lama
                        );

                }


                return jumlah +
                    nilaiTotal;

            },
            0
        );


    totalUang.textContent =
        rupiah(total);


    var belum =
        data.filter(
            function (item) {

                return (
                    item.statusPembayaran !==
                    "Lunas"
                );

            }
        ).length;


    belumLunas.textContent =
        belum;

}


/* ==================================================
   BUKA MODAL TAMBAH
================================================== */

btnTambah.addEventListener(
    "click",
    function () {

        bukaModalTambah();

    }
);


function bukaModalTambah() {

    judulModal.textContent =
        "Tambah Penyewa";


    indexEdit.value = "-1";


    formPenyewa.reset();


    tanggalPenyewa.value =
        tanggalHariIni();


    waktuPenyewa.value =
        waktuSekarang();


    /*
       Set total awal menjadi 0.
    */

    if (totalPenyewaInput) {

        totalPenyewaInput.value =
            0;

    }


    modal.hidden = false;

}


/* ==================================================
   TANGGAL HARI INI
================================================== */

function tanggalHariIni() {

    var sekarang =
        new Date();


    var tahun =
        sekarang.getFullYear();


    var bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");


    var hari =
        String(
            sekarang.getDate()
        ).padStart(2, "0");


    return (
        tahun +
        "-" +
        bulan +
        "-" +
        hari
    );

}


/* ==================================================
   WAKTU SEKARANG
================================================== */

function waktuSekarang() {

    var sekarang =
        new Date();


    var jam =
        String(
            sekarang.getHours()
        ).padStart(2, "0");


    var menit =
        String(
            sekarang.getMinutes()
        ).padStart(2, "0");


    return jam + ":" + menit;

}


/* ==================================================
   TUTUP MODAL
================================================== */

function tutupModal() {

    modal.hidden = true;

}


btnTutupModal.addEventListener(
    "click",
    tutupModal
);


btnBatal.addEventListener(
    "click",
    tutupModal
);


/* ==================================================
   EDIT PENYEWA
================================================== */

function editPenyewa(index) {

    var data =
        bacaData();


    var item =
        data[index];


    if (!item) {

        return;

    }


    judulModal.textContent =
        "Edit Penyewa";


    indexEdit.value =
        index;


    namaPenyewa.value =
        item.nama || "";


    hpPenyewa.value =
        item.hp || "";


    konsolPenyewa.value =
        item.konsol || "PS4";


    lamaPenyewa.value =
        item.lama || 1;


    /*
       Jika data lama belum mempunyai
       tanggal atau waktu, gunakan
       data sekarang.
    */

    tanggalPenyewa.value =
        item.tanggal ||
        tanggalHariIni();


    waktuPenyewa.value =
        item.waktu ||
        waktuSekarang();


    metodePenyewa.value =
        item.metodePembayaran ||
        "Cash";


    statusPenyewa.value =
        item.statusPembayaran ||
        "Belum Dibayar";


    /*
       Hitung ulang total.
    */

    var total =
        hitungTotal(
            konsolPenyewa.value,
            lamaPenyewa.value
        );


    /*
       Jika tarif konsol tersedia,
       gunakan hasil perhitungan.
    */

    if (total > 0) {

        totalPenyewaInput.value =
            total;

    } else {

        /*
           Jika konsol tidak ditemukan
           di daftar harga, gunakan
           total lama.
        */

        totalPenyewaInput.value =
            item.total || 0;

    }


    pengambilanPenyewa.value =
        item.pengambilan ||
        "Ambil sendiri";


    modal.hidden = false;

}


/* ==================================================
   EVENT PERUBAHAN KONSOL
================================================== */

konsolPenyewa.addEventListener(
    "change",
    function () {

        updateTotalForm();

    }
);


/* ==================================================
   EVENT PERUBAHAN LAMA
================================================== */

lamaPenyewa.addEventListener(
    "input",
    function () {

        updateTotalForm();

    }
);


/* ==================================================
   SIMPAN TAMBAH / EDIT
================================================== */

formPenyewa.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        var data =
            bacaData();


        var tanggal =
            tanggalPenyewa.value;


        var waktu =
            waktuPenyewa.value;


        /*
           Ambil lama sewa.
        */

        var lama =
            Number(
                lamaPenyewa.value || 0
            );


        /*
           Hitung total secara otomatis.
        */

        var total =
            hitungTotal(
                konsolPenyewa.value,
                lama
            );


        /*
           Masukkan total ke input
           supaya tetap terlihat pada form.
        */

        if (totalPenyewaInput) {

            totalPenyewaInput.value =
                total;

        }


        var dataBaru = {

            nama:
                namaPenyewa.value.trim(),

            hp:
                hpPenyewa.value.trim(),

            konsol:
                konsolPenyewa.value,

            lama:
                lama,

            tanggal:
                tanggal,

            hari:
                dapatkanHari(
                    tanggal
                ),

            waktu:
                waktu,

            metodePembayaran:
                metodePenyewa.value,

            statusPembayaran:
                statusPenyewa.value,

            total:
                total,

            pengambilan:
                pengambilanPenyewa.value

        };


        /*
           Validasi nama
        */

        if (
            dataBaru.nama.length < 2
        ) {

            alert(
                "Nama penyewa minimal 2 karakter."
            );

            return;

        }


        /*
           Validasi nomor HP
        */

        if (
            !/^[0-9+\s-]{9,16}$/
                .test(dataBaru.hp)
        ) {

            alert(
                "Nomor HP tidak valid."
            );

            return;

        }


        /*
           Validasi lama sewa
        */

        if (
            dataBaru.lama <= 0
        ) {

            alert(
                "Lama sewa harus lebih dari 0 jam."
            );

            return;

        }


        /*
           Validasi harga konsol.
        */

        if (
            !HARGA_KONSOL[
                dataBaru.konsol
            ]
        ) {

            alert(
                "Harga untuk konsol " +
                dataBaru.konsol +
                " belum diatur."
            );

            return;

        }


        var index =
            Number(
                indexEdit.value
            );


        /*
           Jika -1 = data baru
        */

        if (index === -1) {

            data.push(
                dataBaru
            );

            alert(
                "Penyewa berhasil didaftarkan."
            );

        } else {

            data[index] =
                dataBaru;

            alert(
                "Data penyewa berhasil diperbarui."
            );

        }


        /*
           Simpan ke localStorage.
        */

        simpanData(data);


        /*
           Tutup modal.
        */

        tutupModal();


        /*
           Refresh tabel.
        */

        tampilkanData();

    }
);


/* ==================================================
   HAPUS PENYEWA
================================================== */

function hapusPenyewa(index) {

    var data =
        bacaData();


    var item =
        data[index];


    if (!item) {

        return;

    }


    var yakin =
        confirm(
            "Hapus data penyewa " +
            item.nama +
            "?"
        );


    if (!yakin) {

        return;

    }


    data.splice(
        index,
        1
    );


    simpanData(data);


    tampilkanData();


    alert(
        "Data penyewa berhasil dihapus."
    );

}


/* ==================================================
   PENCARIAN
================================================== */

searchInput.addEventListener(
    "input",
    function () {

        tampilkanData();

    }
);


/* ==================================================
   FILTER STATUS
================================================== */

filterStatus.addEventListener(
    "change",
    function () {

        tampilkanData();

    }
);


/* ==================================================
   TUTUP MODAL KLIK DI LUAR
================================================== */

modal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modal
        ) {

            tutupModal();

        }

    }
);


/* ==================================================
   JALANKAN SAAT HALAMAN DIBUKA
================================================== */

cekLogin();
