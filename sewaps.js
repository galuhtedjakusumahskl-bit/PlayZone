/* ==================================================
   MGstore - JavaScript
================================================== */


/* ==================================================
   1. MENU DI HP
================================================== */

var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

if (menuBtn && menu) {

    menuBtn.addEventListener("click", function () {

        menu.classList.toggle("buka");

    });

    menu.addEventListener("click", function () {

        menu.classList.remove("buka");

    });

}


/* ==================================================
   2. TOMBOL SIMBOL DI STIK
   Mengganti warna tema
================================================== */

var tombolSimbol =
    document.querySelectorAll(".tombol-simbol");

var petunjuk =
    document.getElementById("petunjuk");


function gantiTema(el) {

    var warna =
        el.getAttribute("data-warna");

    var namaTema =
        el.getAttribute("data-nama");

    document.documentElement.style
        .setProperty("--aksen", warna);


    if (petunjuk) {

        petunjuk.textContent =
            "Tema " + namaTema + " aktif";

    }


    var toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent =
        "Tema " + namaTema;

    document.body.appendChild(toast);


    setTimeout(function () {

        toast.remove();

    }, 1200);

}


tombolSimbol.forEach(function (el) {

    el.addEventListener(
        "click",
        function () {

            gantiTema(el);

        }
    );


    el.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Enter" ||
                e.key === " "
            ) {

                e.preventDefault();

                gantiTema(el);

            }

        }
    );

});


/* ==================================================
   3. KALKULATOR BIAYA
================================================== */

var unit =
    document.getElementById("unit");

var jam =
    document.getElementById("jam");

var area =
    document.getElementById("area");

var areaWrap =
    document.getElementById("areaWrap");

var alamatWrap =
    document.getElementById("alamatWrap");

var alamat =
    document.getElementById("alamat");

var nama =
    document.getElementById("nama");

var hp =
    document.getElementById("hp");

var metodeWrap =
    document.getElementById("metodeWrap");

var metode =
    document.getElementById("metode");

var infoBayar =
    document.getElementById("infoBayar");

var catatan =
    document.getElementById("catatanPesan");

var pesanWa =
    document.getElementById("pesanWa");


/* ==================================================
   FORMAT RUPIAH
================================================== */

function rupiah(angka) {

    return "Rp" +
        Number(angka || 0)
            .toLocaleString("id-ID");

}


/* ==================================================
   PILIHAN RADIO
================================================== */

function pilihan(kelompok) {

    var pilihanAktif =
        document.querySelector(
            'input[name="' +
            kelompok +
            '"]:checked'
        );

    return pilihanAktif
        ? pilihanAktif.value
        : "";

}


/* ==================================================
   CEK PENGAMBILAN
================================================== */

function diantar() {

    return pilihan("ambil") === "antar";

}


/* ==================================================
   CEK PEMBAYARAN
================================================== */

function cashless() {

    return pilihan("bayar") === "cashless";

}


/* ==================================================
   UNIT YANG DIPILIH
================================================== */

function unitDipilih() {

    if (!unit) {
        return "ps4";
    }

    var option =
        unit.options[
            unit.selectedIndex
        ];

    return option
        ? option.getAttribute("data-unit")
        : "ps4";

}


/* ==================================================
   NAMA UNIT
================================================== */

function namaUnitDipilih() {

    if (!unit) {
        return "PS4";
    }

    var option =
        unit.options[
            unit.selectedIndex
        ];

    if (!option) {
        return "PS4";
    }

    var teks =
        option.text.trim();

    return teks.split(" ")[0];

}


/* ==================================================
   4. PERHITUNGAN BIAYA
================================================== */

function ringkasan() {

    var harga =
        Number(unit.value || 0);

    var lama =
        Number(jam.value || 0);


    /*
       Minimal 1 jam
    */

    if (!lama || lama < 1) {

        lama = 1;

    }


    /*
       Maksimal 24 jam
    */

    if (lama > 24) {

        lama = 24;

    }


    /*
       Bonus setiap 5 jam.
    */

    var jamBonus =
        Math.floor(lama / 5);


    /*
       Hitung biaya sewa.
    */

    var sewa =
        (lama - jamBonus) * harga;


    /*
       Ongkos kirim.
    */

    var ongkir =
        diantar()
            ? Number(area.value || 0)
            : 0;


    return {

        namaUnit:
            namaUnitDipilih(),

        lama:
            lama,

        jamBonus:
            jamBonus,

        sewa:
            sewa,

        ongkir:
            ongkir,

        jumlah:
            sewa + ongkir

    };

}


/* ==================================================
   5. HITUNG DAN TAMPILKAN
================================================== */

function hitung() {

    if (!unit || !jam) {
        return;
    }


    var r =
        ringkasan();


    /*
       Tampilkan/sembunyikan
       pilihan antar.
    */

    if (areaWrap) {

        areaWrap.hidden =
            !diantar();

    }


    if (alamatWrap) {

        alamatWrap.hidden =
            !diantar();

    }


    /*
       Tampilkan/sembunyikan
       metode pembayaran.
    */

    if (metodeWrap) {

        metodeWrap.hidden =
            !cashless();

    }


    /*
       Informasi pembayaran.
    */

    if (infoBayar) {

        infoBayar.textContent =
            cashless()
                ? "Nomor rekening atau QRIS dikirim admin lewat WhatsApp setelah pesananmu diterima."
                : "Bayar tunai saat serah terima (ambil sendiri) atau kepada kurir (diantar).";

    }


    /*
       Tampilkan ringkasan.
    */

    var bonus =
        document.getElementById("bonus");

    var rSewa =
        document.getElementById("rSewa");

    var rOngkir =
        document.getElementById("rOngkir");

    var total =
        document.getElementById("total");


    if (bonus) {

        bonus.textContent =
            r.jamBonus + " jam";

    }


    if (rSewa) {

        rSewa.textContent =
            rupiah(r.sewa);

    }


    if (rOngkir) {

        rOngkir.textContent =
            rupiah(r.ongkir);

    }


    if (total) {

        total.textContent =
            "Total " + rupiah(r.jumlah);

    }


    tampilStok();

    cekForm();

}


/* ==================================================
   6. STOK MGstore
================================================== */

/*
   STOK AWAL MGstore:

   PS4 = 20 unit
   PS5 = 15 unit
*/

function stokAwal() {

    return {

        ps4: 20,

        ps5: 15

    };

}


/* ==================================================
   BACA STOK
================================================== */

function bacaStok() {

    try {

        /*
           Nama penyimpanan sudah diubah
           dari playzone_stok menjadi mgstore_stok.
        */

        var data =
            JSON.parse(
                localStorage.getItem(
                    "mgstore_stok"
                )
            );


        if (
            data &&
            typeof data.ps4 === "number" &&
            typeof data.ps5 === "number"
        ) {

            return data;

        }

    } catch (e) {

        console.log(
            "Gagal membaca stok:",
            e
        );

    }


    /*
       Jika belum ada data,
       gunakan stok awal.
    */

    return stokAwal();

}


/* ==================================================
   SIMPAN STOK
================================================== */

function simpanStok(s) {

    try {

        localStorage.setItem(
            "mgstore_stok",
            JSON.stringify(s)
        );

    } catch (e) {

        console.log(
            "Gagal menyimpan stok:",
            e
        );

    }

}


/* ==================================================
   7. TAMPILKAN STOK
================================================== */

function tampilStok(bump) {

    var s =
        bacaStok();


    document
        .querySelectorAll("[data-stok]")
        .forEach(function (el) {

            var k =
                el.getAttribute(
                    "data-stok"
                );


            var jumlah =
                Number(s[k] || 0);


            if (jumlah > 0) {

                el.textContent =
                    "Stok: " +
                    jumlah +
                    " unit";

            } else {

                el.textContent =
                    "Stok habis";

            }


            el.classList.toggle(
                "habis",
                jumlah === 0
            );


            /*
               Animasi stok ketika
               stok berkurang.
            */

            if (bump === k) {

                el.classList.remove(
                    "bump"
                );


                void el.offsetWidth;


                el.classList.add(
                    "bump"
                );

            }

        });


    /*
       Tampilkan stok pada
       ringkasan kalkulator.
    */

    var sisa =
        s[unitDipilih()] || 0;


    var rStok =
        document.getElementById(
            "rStok"
        );


    if (rStok) {

        rStok.textContent =
            sisa > 0
                ? sisa + " unit"
                : "Habis";

    }

}


/* ==================================================
   8. CEK DATA FORM
================================================== */

function kekurangan() {

    var k = [];


    /*
       Cek stok.
    */

    if (
        bacaStok()[
            unitDipilih()
        ] < 1
    ) {

        return [
            "stok habis, pilih konsol lain"
        ];

    }


    /*
       Cek nama.
    */

    if (
        nama.value.trim().length < 2
    ) {

        k.push("nama");

    }


    /*
       Cek nomor HP.
    */

    if (
        !/^[0-9+\s-]{9,16}$/
            .test(
                hp.value.trim()
            )
    ) {

        k.push("nomor HP");

    }


    /*
       Cek alamat jika diantar.
    */

    if (
        diantar() &&
        alamat.value.trim().length < 5
    ) {

        k.push("alamat antar");

    }


    /*
       Cek semua syarat.
    */

    var semuaDicentang =
        true;


    document
        .querySelectorAll(
            ".syarat-cek"
        )
        .forEach(
            function (c) {

                if (!c.checked) {

                    semuaDicentang =
                        false;

                }

            }
        );


    if (!semuaDicentang) {

        k.push(
            "centang ketiga syarat sewa"
        );

    }


    return k;

}


/* ==================================================
   9. VALIDASI FORM
================================================== */

function cekForm() {

    if (!pesanWa) {
        return;
    }


    var k =
        kekurangan();


    var habis =
        bacaStok()[
            unitDipilih()
        ] < 1;


    pesanWa.classList.toggle(
        "mati",
        k.length > 0
    );


    pesanWa.textContent =
        habis
            ? "Stok habis"
            : "Kirim pesanan ke WhatsApp";


    if (catatan) {

        catatan.textContent =
            k.length === 0
                ? "Semua sudah lengkap. Klik tombol untuk mengirim pesanan."
                : "Belum bisa dikirim. Lengkapi: " +
                  k.join(", ") +
                  ".";

    }

}


/* ==================================================
   10. PESAN WHATSAPP
================================================== */

function buatPesan(r) {

    var baris = [

        "*PESANAN SEWA PS - MGstore*",

        "Nama: " +
            nama.value.trim(),

        "No. HP: " +
            hp.value.trim(),

        "Konsol: " +
            r.namaUnit,

        "Lama sewa: " +
            r.lama +
            " jam (bonus " +
            r.jamBonus +
            " jam)",

        "Pengambilan: " +
            (
                diantar()
                    ? "Diantar"
                    : "Ambil sendiri"
            )

    ];


    /*
       Alamat hanya jika
       menggunakan layanan antar.
    */

    if (diantar()) {

        baris.push(
            "Alamat antar: " +
            alamat.value.trim()
        );

    }


    baris.push(

        "Biaya sewa: " +
        rupiah(r.sewa),

        "Ongkos antar: " +
        rupiah(r.ongkir),

        "*Total: " +
        rupiah(r.jumlah) +
        "*",

        "Pembayaran: " +
        (
            cashless()
                ? "Cashless (" +
                  metode.value +
                  ")"
                : "Cash"
        ),

        "Syarat sewa: sudah disetujui " +
        "(jaminan identitas, deposit Rp50.000, " +
        "denda keterlambatan)"

    );


    return baris.join("\n");

}


/* ==================================================
   11. KIRIM PESANAN KE WHATSAPP
================================================== */

if (pesanWa) {

    pesanWa.addEventListener(
        "click",
        function () {

            var k =
                kekurangan();


            /*
               Jangan kirim jika form belum lengkap.
            */

            if (k.length > 0) {

                if (catatan) {

                    catatan.textContent =
                        "Belum bisa dikirim. " +
                        "Lengkapi: " +
                        k.join(", ") +
                        ".";

                }

                return;

            }


            /*
               Ambil unit yang dipilih.
            */

            var kunci =
                unitDipilih();


            /*
               Ambil stok terbaru.
            */

            var s =
                bacaStok();


            /*
               Kurangi stok 1.
            */

            s[kunci] =
                Number(s[kunci]) - 1;


            /*
               Simpan stok terbaru.
            */

            simpanStok(s);


            /*
               Buat pesan.
            */

            var pesan =
                buatPesan(
                    ringkasan()
                );


            /*
               Nomor WhatsApp MGstore.
               Ganti nomor ini jika nomor
               toko kamu berbeda.
            */

            var nomorWhatsApp =
                "628123456789";


            /*
               Buka WhatsApp.
            */

            window.open(
                "https://wa.me/" +
                nomorWhatsApp +
                "?text=" +
                encodeURIComponent(pesan),
                "_blank",
                "noopener"
            );


            /*
               Reset checkbox syarat.
            */

            document
                .querySelectorAll(
                    ".syarat-cek"
                )
                .forEach(
                    function (c) {

                        c.checked = false;

                    }
                );


            /*
               Update tampilan stok.
            */

            tampilStok(kunci);

            cekForm();


            if (catatan) {

                catatan.textContent =
                    "Pesanan dikirim ke WhatsApp " +
                    "dan stok " +
                    "berkurang 1. " +
                    "Centang syarat lagi " +
                    "untuk pesanan baru.";

            }

        }
    );

}


/* ==================================================
   12. RESET STOK
================================================== */

var resetStok =
    document.getElementById(
        "resetStok"
    );


if (resetStok) {

    resetStok.addEventListener(
        "click",
        function () {

            /*
               Reset menjadi:

               PS4 = 20
               PS5 = 15
            */

            simpanStok(
                stokAwal()
            );


            hitung();

        }
    );

}


/* ==================================================
   13. EVENT KALKULATOR
================================================== */

var kalkulator =
    document.querySelector(
        ".kalkulator"
    );


if (kalkulator) {

    kalkulator.addEventListener(
        "input",
        hitung
    );


    kalkulator.addEventListener(
        "change",
        hitung
    );

}


/* ==================================================
   14. ANIMASI MUNCUL SAAT SCROLL
================================================== */

var kurangiGerak =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    "IntersectionObserver" in window &&
    !kurangiGerak
) {

    var pengamat =
        new IntersectionObserver(
            function (daftar) {

                daftar.forEach(
                    function (d) {

                        if (
                            !d.isIntersecting
                        ) {

                            return;

                        }


                        var el =
                            d.target;


                        el.classList.add(
                            "tampil"
                        );


                        pengamat.unobserve(
                            el
                        );


                        setTimeout(
                            function () {

                                el.style
                                    .transitionDelay =
                                    "";

                            },
                            1000
                        );

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    document
        .querySelectorAll(
            ".bagian h2, " +
            ".bagian .lead, " +
            ".kartu, " +
            ".kalkulator, " +
            ".chips span, " +
            ".syarat, " +
            ".tabel-wrap, " +
            ".alur, " +
            ".sub, " +
            ".ajakan h2, " +
            ".ajakan p"
        )
        .forEach(
            function (el) {

                var urutan =
                    Array.prototype.indexOf.call(
                        el.parentNode.children,
                        el
                    );


                el.classList.add(
                    "reveal"
                );


                el.style.transitionDelay =
                    Math.min(
                        urutan,
                        6
                    ) * 70 + "ms";


                pengamat.observe(
                    el
                );

            }
        );

}


/* ==================================================
   15. JALANKAN SAAT HALAMAN DIBUKA
================================================== */

hitung();

tampilStok();