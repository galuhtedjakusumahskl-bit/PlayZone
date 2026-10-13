var formLogin = document.getElementById("formLogin");

var halamanLogin = document.getElementById("halamanLogin");
var halamanSewa = document.getElementById("halamanSewa");

var loginNama = document.getElementById("loginNama");
var loginHp = document.getElementById("loginHp");

var pesanLogin = document.getElementById("pesanLogin");

var namaPenyewa = document.getElementById("namaPenyewa");
var daftarRiwayat = document.getElementById("daftarRiwayat");

var jumlahPesanan = document.getElementById("jumlahPesanan");
var totalPembayaran = document.getElementById("totalPembayaran");
var pesananTerakhir = document.getElementById("pesananTerakhir");

var tidakAdaData = document.getElementById("tidakAdaData");
var logout = document.getElementById("logout");


function rupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
}


/* Mengambil semua riwayat pesanan */

function bacaRiwayat() {

    try {

        var data = JSON.parse(
            localStorage.getItem("playzone_riwayat")
        );

        if (Array.isArray(data)) {
            return data;
        }

    } catch (e) {}

    return [];
}


/* Menampilkan riwayat penyewa */

function tampilkanRiwayat(nama, hp) {

    var semuaData = bacaRiwayat();

    var dataPenyewa = semuaData.filter(function (pesanan) {

        return (
            pesanan.nama.toLowerCase() === nama.toLowerCase() &&
            pesanan.hp === hp
        );

    });


    namaPenyewa.textContent = nama;

    daftarRiwayat.innerHTML = "";


    if (dataPenyewa.length === 0) {

        tidakAdaData.hidden = false;

        jumlahPesanan.textContent = "0";
        totalPembayaran.textContent = "Rp0";
        pesananTerakhir.textContent = "-";

        return;
    }


    tidakAdaData.hidden = true;


    jumlahPesanan.textContent = dataPenyewa.length;


    var total = dataPenyewa.reduce(function (jumlah, pesanan) {

        return jumlah + Number(pesanan.total);

    }, 0);

    totalPembayaran.textContent = rupiah(total);


    pesananTerakhir.textContent =
        dataPenyewa[dataPenyewa.length - 1].tanggal;


    /* Menampilkan data dari yang terbaru */

    dataPenyewa.reverse().forEach(function (pesanan) {

        var kartu = document.createElement("div");

        kartu.className = "kartu-sewa";


        kartu.innerHTML = `

            <div class="kartu-header">

                <div>
                    <h3>${pesanan.konsol}</h3>
                    <p>Pesanan dibuat ${pesanan.waktu}</p>
                </div>

                <span class="status-bayar">
                    ${pesanan.statusPembayaran}
                </span>

            </div>


            <div class="detail">

                <div>
                    <small>Nama Penyewa</small>
                    <strong>${pesanan.nama}</strong>
                </div>

                <div>
                    <small>Nomor HP</small>
                    <strong>${pesanan.hp}</strong>
                </div>

                <div>
                    <small>Tanggal</small>
                    <strong>${pesanan.tanggal}</strong>
                </div>

                <div>
                    <small>Hari</small>
                    <strong>${pesanan.hari}</strong>
                </div>

                <div>
                    <small>Waktu Pesanan</small>
                    <strong>${pesanan.waktu}</strong>
                </div>

                <div>
                    <small>Lama Sewa</small>
                    <strong>${pesanan.lama} jam</strong>
                </div>

                <div>
                    <small>Metode Pembayaran</small>
                    <strong>${pesanan.metodePembayaran}</strong>
                </div>

                <div>
                    <small>Pengambilan</small>
                    <strong>${pesanan.pengambilan}</strong>
                </div>

            </div>

            <div class="total-bayar">
                Total Pembayaran: ${rupiah(pesanan.total)}
            </div>
        `;


        daftarRiwayat.appendChild(kartu);

    });

}


/* LOGIN */

formLogin.addEventListener("submit", function (e) {

    e.preventDefault();


    var nama = loginNama.value.trim();
    var hp = loginHp.value.trim();


    if (nama.length < 2) {

        pesanLogin.textContent =
            "Nama penyewa minimal 2 karakter.";

        return;
    }


    if (!/^[0-9+\s-]{9,16}$/.test(hp)) {

        pesanLogin.textContent =
            "Nomor HP tidak valid.";

        return;
    }


    pesanLogin.textContent = "";


    halamanLogin.hidden = true;
    halamanSewa.hidden = false;


    tampilkanRiwayat(nama, hp);

});


/* LOGOUT */

logout.addEventListener("click", function () {

    halamanSewa.hidden = true;
    halamanLogin.hidden = false;

    loginNama.value = "";
    loginHp.value = "";

});