const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Times New Roman", size: 24, ...opts })],
    spacing: { after: 120 },
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
  });
}

function heading(text, level = 1) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Times New Roman", size: 24, bold: true })],
    spacing: { before: 200, after: 120 },
    alignment: AlignmentType.LEFT,
  });
}

function subheading(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Times New Roman", size: 24, bold: true })],
    spacing: { before: 160, after: 100 },
    alignment: AlignmentType.LEFT,
  });
}

function blank() {
  return new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } });
}

function centered(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Times New Roman", size: 24, ...opts })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
  });
}

// Cover page rows
function coverRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 2500, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: "Times New Roman", size: 24 })] })]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 400, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: ":", font: "Times New Roman", size: 24 })] })]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 5000, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: value, font: "Times New Roman", size: 24 })] })]
      }),
    ]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } }
    }
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "-",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 }
        }
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "LAPORAN PRAKTIKUM", font: "Times New Roman", size: 28, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "PRAKTIKUM PEMROGRAMAN WEB", font: "Times New Roman", size: 28, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "PERTEMUAN 10", font: "Times New Roman", size: 28, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "JAVASCRIPT", font: "Times New Roman", size: 28, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 2000 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Disusun oleh:", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.CENTER, spacing: { after: 200 }
        }),
        new Table({
          width: { size: 6000, type: WidthType.DXA },
          columnWidths: [2500, 400, 5000],
          alignment: AlignmentType.CENTER,
          rows: [
            coverRow("Nama", "Gayuh Mukti Aji"),
            coverRow("NIM", "25/566296/SV/27058"),
            coverRow("Kelas", "B1"),
            coverRow("Dosen Pengampu", "Achmad Choirudin Emcha, S.Kom., M.Eng."),
          ]
        }),
        blank(),
        blank(),
        blank(),
        new Paragraph({
          children: [new TextRun({ text: "PROGRAM STUDI D-IV TEKNOLOGI REKAYASA PERANGKAT LUNAK", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "DEPARTEMEN TEKNIK ELEKTRO DAN INFORMATIKA", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "SEKOLAH VOKASI", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "UNIVERSITAS GADJAH MADA", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "YOGYAKARTA", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2026", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
      ]
    },
    // ===== DAFTAR ISI =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 }
        }
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "DAFTAR ISI", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 240 }
        }),
        // TOC entries
        ...[
          ["A. Tujuan Percobaan", "1"],
          ["B. Dasar Teori", "1"],
          ["C. Hasil dan Pembahasan", "2"],
          ["D. Kesimpulan", "8"],
          ["E. Daftar Pustaka", "8"],
        ].map(([label, page]) => new Paragraph({
          children: [
            new TextRun({ text: label, font: "Times New Roman", size: 24 }),
            new TextRun({ text: "\t" + page, font: "Times New Roman", size: 24 }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { after: 160 }
        })),
      ]
    },
    // ===== MAIN CONTENT =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 }
        }
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 24 })],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      children: [
        // TITLE
        new Paragraph({
          children: [new TextRun({ text: "PERTEMUAN 10", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "JAVASCRIPT", font: "Times New Roman", size: 24, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 240 }
        }),

        // A. TUJUAN
        heading("A. Tujuan Percobaan"),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu menjelaskan peran JavaScript dalam pengembangan web.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu menulis JavaScript dengan tiga cara: embed, inline, dan eksternal.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu mendeklarasikan variabel menggunakan var, let, dan const serta memahami perbedaannya.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu menggunakan tipe data primitif dan operator JavaScript dengan benar.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu membangun logika program menggunakan percabangan dan perulangan.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu mendefinisikan fungsi dan menggunakan arrow function modern.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Mahasiswa mampu memanipulasi DOM untuk membuat halaman web yang interaktif dan dinamis.", font: "Times New Roman", size: 24 })],
          spacing: { after: 240 }
        }),

        // B. DASAR TEORI
        heading("B. Dasar Teori"),
        new Paragraph({
          children: [
            new TextRun({ text: "JavaScript", font: "Times New Roman", size: 24, bold: true }),
            new TextRun({ text: " adalah bahasa pemrograman tingkat tinggi yang awalnya dirancang untuk berjalan di dalam browser web. Bahasa ini pertama kali dikembangkan oleh Brendan Eich pada tahun 1995 dengan nama Mocha, kemudian berganti menjadi LiveScript, dan akhirnya dikenal sebagai JavaScript [1]. Seiring perkembangannya, JavaScript tidak hanya digunakan di sisi klien (client-side), melainkan juga di sisi server melalui platform seperti Node.js, pengembangan aplikasi mobile dengan React Native, aplikasi desktop menggunakan Electron, hingga kecerdasan buatan [2].", font: "Times New Roman", size: 24 })
          ],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Dalam pemrograman web modern, JavaScript berperan sebagai salah satu dari tiga teknologi inti web bersama HTML dan CSS. HTML berfungsi untuk mendefinisikan struktur konten, CSS untuk mengatur tampilan, sedangkan JavaScript memberikan interaktivitas dan dinamika pada halaman web. JavaScript memungkinkan manipulasi DOM (Document Object Model), validasi formulir, komunikasi asinkronus dengan server (AJAX), serta berbagai interaksi pengguna secara real-time tanpa perlu memuat ulang halaman [3].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "JavaScript mendukung paradigma pemrograman multi-paradigma, termasuk pemrograman prosedural, berorientasi objek, dan fungsional. Versi modern JavaScript mengikuti standar ECMAScript (ES), dengan ES6 (ECMAScript 2015) memperkenalkan fitur-fitur penting seperti arrow function, let/const, template literals, destructuring, dan modul [4]. Fitur-fitur ini secara signifikan meningkatkan keterbacaan kode dan produktivitas pengembang.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "DOM (Document Object Model) merupakan antarmuka pemrograman yang merepresentasikan dokumen HTML sebagai struktur pohon objek. Setiap elemen HTML menjadi sebuah node dalam pohon tersebut, dan JavaScript dapat mengakses serta memanipulasi node-node ini secara dinamis. Manipulasi DOM memungkinkan pengembang untuk menambah, mengubah, atau menghapus elemen dan atribut HTML, mengubah gaya CSS, serta menangani event dari pengguna secara real-time [5].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 240 }
        }),

        // C. HASIL DAN PEMBAHASAN
        heading("C. Hasil dan Pembahasan"),

        // LATIHAN - TO DO LIST
        subheading("1. Analisis Proyek Mini To-Do List Interaktif"),
        new Paragraph({
          children: [new TextRun({ text: "Proyek mini To-Do List merupakan latihan komprehensif yang mencakup seluruh konsep manipulasi DOM yang dipelajari pada praktikum ini. Berikut adalah analisis kode program tersebut.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("a. Pemilihan Elemen DOM"),
        new Paragraph({
          children: [new TextRun({ text: "Pada bagian inisialisasi, program menggunakan document.getElementById() untuk memilih tiga elemen utama: input teks (inputTugas), tombol tambah (btnTambah), daftar tugas (daftarTugas), dan paragraf info (info). Pemilihan elemen dilakukan di luar fungsi agar referensi hanya dibuat sekali dan dapat digunakan berulang kali, sehingga lebih efisien dari segi performa.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("b. Fungsi perbaruiInfo()"),
        new Paragraph({
          children: [new TextRun({ text: "Fungsi ini bertanggung jawab memperbarui teks informasi jumlah tugas yang tersisa. Fungsi menggunakan operator ternary untuk menentukan teks yang ditampilkan: jika variabel jumlah bernilai 0, maka ditampilkan 'Tidak ada tugas'; jika lebih dari 0, ditampilkan jumlah tugas beserta satuannya. Fungsi ini dipanggil setiap kali ada perubahan jumlah tugas, yaitu setelah penambahan atau penghapusan tugas.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("c. Fungsi tambahTugas()"),
        new Paragraph({
          children: [new TextRun({ text: "Ini adalah fungsi utama yang menangani penambahan item tugas baru. Alur kerja fungsi ini adalah sebagai berikut:", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Validasi input: Program pertama-tama mengambil nilai dari input teks menggunakan input.value.trim() untuk menghilangkan spasi di awal dan akhir. Jika hasilnya kosong, program menampilkan alert peringatan dan keluar dari fungsi menggunakan return.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Pembuatan elemen: Program membuat elemen <li> baru menggunakan document.createElement('li') dan mengatur class Bootstrap-nya. Di dalamnya dibuat elemen <span> untuk menampilkan teks tugas dan elemen <button> untuk tombol hapus.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Event listener pada span: Klik pada teks tugas akan memicu logika toggle yang memeriksa nilai style.textDecoration. Jika nilainya 'line-through', berarti tugas sudah ditandai selesai dan akan dikembalikan ke normal; sebaliknya, tugas akan diberi garis coret sebagai tanda selesai.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Event listener pada tombol hapus: Klik pada tombol hapus memanggil li.remove() untuk menghapus elemen dari DOM, kemudian mengurangi counter jumlah dan memanggil perbaruiInfo().", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Penyusunan elemen: Elemen span dan button disisipkan ke dalam li menggunakan appendChild(), kemudian li disisipkan ke dalam daftar (ul) juga dengan appendChild().", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Reset input: Setelah tugas berhasil ditambahkan, nilai input dikosongkan (input.value = '') dan fokus dikembalikan ke input menggunakan input.focus() untuk memudahkan pengguna menambah tugas berikutnya.", font: "Times New Roman", size: 24 })],
          spacing: { after: 160 }
        }),

        subheading("d. Event Listener Global"),
        new Paragraph({
          children: [new TextRun({ text: "Program mendaftarkan dua event listener di bagian akhir skrip. Pertama, tombol tambah (btnTambah) mendengarkan event 'click' untuk memanggil fungsi tambahTugas(). Kedua, elemen input mendengarkan event 'keydown'; jika tombol yang ditekan adalah Enter (e.key === 'Enter'), maka fungsi tambahTugas() juga akan dipanggil. Pendekatan ini memberikan pengalaman pengguna yang lebih baik karena mendukung dua cara berbeda untuk menambahkan tugas.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("e. Konsep JavaScript yang Diterapkan"),
        new Paragraph({
          children: [new TextRun({ text: "Proyek To-Do List ini menggabungkan berbagai konsep JavaScript secara terpadu, antara lain: manipulasi DOM (createElement, appendChild, remove), event handling (addEventListener), variabel let/const, arrow function, operator ternary, validasi input, serta penggunaan library Bootstrap untuk tampilan antarmuka. Proyek ini menjadi bukti nyata bagaimana JavaScript dapat membuat halaman web statis menjadi interaktif dan dinamis.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 240 }
        }),

        // TUGAS 1
        subheading("2. Tugas 1 – Penulisan JavaScript & Output"),
        new Paragraph({
          children: [new TextRun({ text: "Tugas 1 meminta pembuatan satu file HTML yang menggabungkan ketiga cara penulisan JavaScript: inline, embed, dan eksternal, dengan masing-masing menghasilkan output melalui keempat metode (console.log, alert, document.write, dan innerHTML).", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("a. Inline JavaScript"),
        new Paragraph({
          children: [new TextRun({ text: "Cara inline menempatkan JavaScript langsung pada atribut event HTML. Pada implementasi ini, empat tombol Bootstrap dibuat dengan atribut onclick yang masing-masing memanggil: alert() untuk menampilkan dialog popup, console.log() untuk menampilkan pesan di konsol browser, document.write() untuk menulis langsung ke dokumen HTML, dan innerHTML untuk memperbarui konten elemen div#outputInline. Cara ini cocok untuk aksi sederhana yang terikat pada elemen tertentu.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("b. Embed JavaScript"),
        new Paragraph({
          children: [new TextRun({ text: "Cara embed menempatkan kode JavaScript di dalam tag <script> yang berada langsung di dalam file HTML, pada kasus ini di dalam <body>. Pada bagian ini, kode langsung dieksekusi saat halaman dimuat, menampilkan alert dari embed, mencetak pesan di console, dan mengubah innerHTML elemen div#outputEmbed. Posisi tag <script> di akhir <body> memastikan elemen HTML telah tersedia di DOM sebelum JavaScript dieksekusi.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("c. Eksternal JavaScript"),
        new Paragraph({
          children: [new TextRun({ text: "Cara eksternal memisahkan kode JavaScript ke dalam file terpisah (eksternal.js) yang kemudian dimuat oleh HTML menggunakan atribut src pada tag <script>. File eksternal.js berisi empat output: console.log, alert, document.write, dan innerHTML. Pemisahan ini meningkatkan keterbacaan kode, memudahkan pemeliharaan, serta memungkinkan reuse kode di berbagai halaman HTML sekaligus.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 240 }
        }),

        // TUGAS 2
        subheading("3. Tugas 2 – Form Pendataan Praktikan dengan Operator"),
        new Paragraph({
          children: [new TextRun({ text: "Tugas 2 mengimplementasikan form pendataan praktikan menggunakan dialog interaktif JavaScript dan menampilkan hasilnya dalam tabel Bootstrap.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("a. Alur Program"),
        new Paragraph({
          children: [new TextRun({ text: "Saat tombol 'Mulai Pendataan' diklik, fungsi mulaiPendataan() dipanggil. Fungsi ini pertama-tama menampilkan dialog confirm() untuk memverifikasi apakah pengguna adalah mahasiswa PPW1. Jika pengguna memilih OK (jawab == true), program akan melanjutkan pengumpulan data. Jika tidak, program menampilkan pesan penolakan kreatif menggunakan innerHTML.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("b. Pengumpulan Data dengan prompt()"),
        new Paragraph({
          children: [new TextRun({ text: "Program menggunakan tiga dialog prompt() secara berurutan untuk mengambil Nama, NIM, dan Angkatan dari pengguna. Setelah pengambilan data, dilakukan validasi ganda: pertama memeriksa apakah pengguna menekan Cancel (nilai null), kemudian memeriksa apakah input kosong. Jika salah satu kondisi terpenuhi, program menampilkan pesan error dan berhenti.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("c. Penggunaan Operator"),
        new Paragraph({
          children: [new TextRun({ text: "Program menerapkan dua operator utama sesuai spesifikasi tugas. Pertama, operator aritmatika penjumlahan digunakan untuk menghitung tahun lulus dengan menjumlahkan angkatan dengan 4 (parseInt(angkatan) + 4). Kemudian dihitung sisa tahun dengan pengurangan (tahunLulus - tahunSekarang). Kedua, operator modulo (%) digunakan untuk menentukan apakah nilai NIM merupakan bilangan genap atau ganjil: nimAngka % 2 == 0 menghasilkan 'Genap', selain itu 'Ganjil'.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("d. Penanganan Kasus Sisa Tahun"),
        new Paragraph({
          children: [new TextRun({ text: "Program menggunakan percabangan if-else untuk menangani tiga kemungkinan nilai sisaTahun: lebih dari 0 (masih dalam masa studi), sama dengan 0 (tahun kelulusan), dan kurang dari 0 (sudah melewati batas waktu normal). Untuk kasus terakhir, digunakan Math.abs() untuk menampilkan nilai absolut selisih tahun.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }
        }),

        subheading("e. Tampilan Tabel Bootstrap"),
        new Paragraph({
          children: [new TextRun({ text: "Data yang terkumpul ditampilkan dalam tabel Bootstrap (table-bordered table-striped) dengan header berwarna gelap (table-dark). Tabel dibangun secara dinamis menggunakan concatenation string HTML yang kemudian disisipkan ke elemen div#hasil melalui innerHTML. Selain itu, data juga dicetak ke console browser menggunakan console.log() untuk keperluan debugging.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 240 }
        }),

        // D. KESIMPULAN
        heading("D. Kesimpulan"),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "JavaScript adalah bahasa pemrograman yang sangat fleksibel dan dapat ditulis dengan tiga cara berbeda dalam HTML: inline (pada atribut event), embed (dalam tag <script>), dan eksternal (file .js terpisah). Masing-masing cara memiliki keunggulan dan konteks penggunaan tersendiri.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Output JavaScript dapat ditampilkan melalui empat metode: console.log() untuk debugging, alert() untuk notifikasi popup, document.write() untuk penulisan langsung ke dokumen, dan innerHTML untuk pembaruan konten elemen tertentu yang merupakan metode terbaik dalam pengembangan web modern.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "JavaScript menyediakan beragam operator (aritmatika, penugasan, perbandingan, logika, ternary) dan struktur kontrol (if-else, switch, for, while, forEach) yang memungkinkan pembuatan logika program yang kompleks dan interaktif.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Manipulasi DOM adalah inti dari interaktivitas web dengan JavaScript. Melalui metode seperti getElementById(), querySelector(), createElement(), dan addEventListener(), pengembang dapat membuat halaman web yang merespons aksi pengguna secara dinamis tanpa perlu memuat ulang halaman.", font: "Times New Roman", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Proyek To-Do List membuktikan bagaimana berbagai konsep JavaScript (variabel, fungsi, event handling, manipulasi DOM) dapat dikombinasikan untuk menghasilkan aplikasi web yang fungsional dan mudah digunakan.", font: "Times New Roman", size: 24 })],
          spacing: { after: 240 }
        }),

        // E. DAFTAR PUSTAKA
        heading("E. Daftar Pustaka"),
        new Paragraph({
          children: [new TextRun({ text: "[1] A. Hidayat, \"Sejarah dan Perkembangan JavaScript dari Masa ke Masa,\" Niagahoster Blog, 15 Maret 2022. [Online]. Tersedia: https://www.niagahoster.co.id/blog/javascript-adalah/. [Diakses: 10 Mei 2026].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: 720, hanging: 720 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "[2] R. Pratama, \"Mengenal JavaScript: Pengertian, Fungsi, dan Cara Kerjanya,\" Dicoding Blog, 20 Januari 2023. [Online]. Tersedia: https://www.dicoding.com/blog/apa-itu-javascript/. [Diakses: 10 Mei 2026].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: 720, hanging: 720 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "[3] B. Santoso, \"Panduan Lengkap DOM (Document Object Model) dalam JavaScript,\" Petani Kode, 5 Februari 2023. [Online]. Tersedia: https://www.petanikode.com/javascript-dom/. [Diakses: 10 Mei 2026].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: 720, hanging: 720 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "[4] D. Kurniawan, \"Fitur Baru JavaScript ES6 yang Wajib Kamu Ketahui,\" Codepolitan, 10 Agustus 2022. [Online]. Tersedia: https://codepolitan.com/blog/fitur-es6-javascript/. [Diakses: 10 Mei 2026].", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: 720, hanging: 720 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "[5] A. C. Emcha, \"Modul Praktikum Pemrograman Web 1: BAB X – JavaScript,\" Program Studi D-IV Teknologi Rekayasa Perangkat Lunak, Sekolah Vokasi, Universitas Gadjah Mada, Yogyakarta, 2026.", font: "Times New Roman", size: 24 })],
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: 720, hanging: 720 }
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('./Laporan_Praktikum_PPW_Pertemuan10.docx', buffer);
  console.log('Done!');
});