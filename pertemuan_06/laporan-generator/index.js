const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, ImageRun, Header, Footer,
  PageNumber, TabStopType, TabStopPosition, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// A4 page: 11906 x 16838 DXA, margins 2.5cm = 1417 DXA each side
// content width = 11906 - 2*1417 = 9072 DXA ... use standard 2.5cm margins
// Actually use typical Indonesian academic: top/bottom 3cm=1701, left 4cm=2268, right 3cm=1701
// content width = 11906 - 2268 - 1701 = 7937 DXA
const PAGE = {
  width: 11906,
  height: 16838,
  margin: { top: 1701, bottom: 1701, left: 2268, right: 1701 }
};
const CONTENT_W = PAGE.width - PAGE.margin.left - PAGE.margin.right; // 7937

function heading(text, level, center = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: 'Times New Roman', size: 24 })],
    alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
  });
}

function bodyPara(runs, options = {}) {
  return new Paragraph({
    children: runs,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 480, lineRule: 'auto', before: 0, after: 120 },
    indent: options.firstLine ? { firstLine: 720 } : undefined,
    ...options,
  });
}

function tr(text, bold = false, italic = false, size = 24) {
  return new TextRun({ text, bold, italic, font: 'Times New Roman', size });
}

function codeBlock(code) {
  const lines = code.split('\n');
  const rows = lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 20 })],
      spacing: { line: 240, lineRule: 'auto', before: 0, after: 0 },
    })
  );
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill: '1E1E1E', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            borders: {
              top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
            },
            children: rows,
          })
        ]
      })
    ]
  });
}

function codeBlockLines(lines) {
  const paragraphs = lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 20, color: 'FFFFFF' })],
      spacing: { line: 240, lineRule: 'auto', before: 0, after: 0 },
    })
  );
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill: '1E1E1E', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            borders: {
              top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
            },
            children: paragraphs,
          })
        ]
      })
    ]
  });
}

// Helper for numbered list
function numberedItem(text, num) {
  return new Paragraph({
    children: [tr(`${num}. ${text}`)],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 480, lineRule: 'auto', before: 0, after: 60 },
    indent: { left: 720, hanging: 360 },
  });
}

function bulletItem(text, indent = 720) {
  return new Paragraph({
    children: [tr(text)],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 480, lineRule: 'auto', before: 0, after: 60 },
    indent: { left: indent, hanging: 360 },
    numbering: { reference: 'bullets', level: 0 },
  });
}

function letterItem(letter, text) {
  return new Paragraph({
    children: [tr(`${letter}. ${text}`)],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 480, lineRule: 'auto', before: 0, after: 60 },
    indent: { left: 360, hanging: 0 },
  });
}

function sectionLabel(label, desc) {
  return bodyPara([tr(label, true), tr(desc)]);
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 24 } }
    },
  },
  sections: [
    // ========== COVER PAGE ==========
    {
      properties: {
        page: {
          size: { width: PAGE.width, height: PAGE.height },
          margin: PAGE.margin,
        }
      },
      children: [
        new Paragraph({
          children: [tr('LAPORAN PRAKTIKUM', true, false, 24)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1440, after: 0 },
        }),
        new Paragraph({
          children: [tr('PRAKTIKUM PEMROGRAMAN WEB', true, false, 24)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
        }),
        new Paragraph({
          children: [tr('PERTEMUAN 6', true, false, 24)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
        }),
        new Paragraph({
          children: [tr('BOOTSTRAP', true, false, 24)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 2880 },
        }),
        new Paragraph({
          children: [tr('Disusun oleh:', false, false, 24)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 240 },
        }),
        // Info table
        new Table({
          width: { size: 5000, type: WidthType.DXA },
          columnWidths: [1800, 2200],
          alignment: AlignmentType.CENTER,
          rows: [
            new TableRow({ children: [
              new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr('Nama')] })] }),
              new TableCell({ width: { size: 2200, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr(': Gayuh Mukti Aji')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr('NIM')] })] }),
              new TableCell({ width: { size: 2200, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr(': 25/566296/SV/27058')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr('Kelas')] })] }),
              new TableCell({ width: { size: 2200, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr(': B1')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr('Dosen Pengampu')] })] }),
              new TableCell({ width: { size: 2200, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ children: [tr(': Achmad Choirudin Emcha, S.Kom., M.Eng.')] })] }),
            ]}),
          ]
        }),
        new Paragraph({ children: [], spacing: { before: 2880, after: 0 } }),
        new Paragraph({ children: [tr('PROGRAM STUDI D-IV TEKNOLOGI REKAYASA PERANGKAT LUNAK', true, false, 24)], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [tr('DEPARTEMEN TEKNIK ELEKTRO DAN INFORMATIKA', true, false, 24)], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [tr('SEKOLAH VOKASI', true, false, 24)], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [tr('UNIVERSITAS GADJAH MADA', true, false, 24)], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [tr('YOGYAKARTA', true, false, 24)], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [tr('2026', true, false, 24)], alignment: AlignmentType.CENTER }),
      ]
    },
    // ========== DAFTAR ISI ==========
    {
      properties: {
        page: {
          size: { width: PAGE.width, height: PAGE.height },
          margin: PAGE.margin,
        }
      },
      children: [
        new Paragraph({ children: [tr('DAFTAR ISI', true)], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 } }),
        ...[
          ['A. Tujuan Percobaan', '1'],
          ['B. Dasar Teori', '1'],
          ['C. Hasil dan Pembahasan', '2'],
          ['D. Kesimpulan', '8'],
          ['E. Daftar Pustaka', '8'],
        ].map(([label, page]) =>
          new Paragraph({
            children: [
              new TextRun({ text: label, font: 'Times New Roman', size: 24 }),
              new TextRun({ text: '\t' + page, font: 'Times New Roman', size: 24 }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
            spacing: { line: 480, lineRule: 'auto', before: 0, after: 0 },
          })
        ),
      ]
    },
    // ========== MAIN CONTENT ==========
    {
      properties: {
        page: {
          size: { width: PAGE.width, height: PAGE.height },
          margin: PAGE.margin,
        }
      },
      children: [
        // TITLE
        new Paragraph({ children: [tr('PERTEMUAN 6', true)], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
        new Paragraph({ children: [tr('BOOTSTRAP', true)], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 } }),

        // A. TUJUAN
        new Paragraph({ children: [tr('A. Tujuan Percobaan', true)], spacing: { before: 240, after: 120 } }),
        numberedItem('Memahami konsep dasar Bootstrap sebagai framework CSS yang memudahkan pengembangan tampilan web yang responsif dan konsisten.', 1),
        numberedItem('Mampu mengimplementasikan komponen-komponen Bootstrap seperti Navbar, Card, Form, Tabel, dan Modal pada halaman web.', 2),
        numberedItem('Memahami dan menerapkan sistem grid Bootstrap untuk membuat layout halaman yang responsif di berbagai ukuran layar.', 3),
        numberedItem('Mampu mengintegrasikan komponen interaktif Bootstrap seperti Modal yang membutuhkan JavaScript Bootstrap.', 4),

        // B. DASAR TEORI
        new Paragraph({ children: [tr('B. Dasar Teori', true)], spacing: { before: 240, after: 120 } }),
        bodyPara([tr('Bootstrap adalah framework CSS open-source yang paling populer untuk membangun antarmuka web yang responsif dan berfokus pada perangkat mobile (mobile-first). Bootstrap menyediakan sekumpulan komponen siap pakai, sistem grid yang fleksibel, dan utilitas CSS yang memudahkan developer dalam menciptakan tampilan yang konsisten di berbagai ukuran layar dan browser.')], { firstLine: true }),
        bodyPara([tr('Sistem grid Bootstrap didasarkan pada 12 kolom, di mana developer dapat menentukan lebar elemen menggunakan kelas seperti '), tr('col-md-6', false, true), tr(' (setengah lebar pada layar medium ke atas) atau '), tr('col-lg-3', false, true), tr(' (seperempat lebar pada layar besar). Kelas-kelas breakpoint yang tersedia adalah '), tr('xs', false, true), tr(' (< 576px), '), tr('sm', false, true), tr(' (≥ 576px), '), tr('md', false, true), tr(' (≥ 768px), '), tr('lg', false, true), tr(' (≥ 992px), dan '), tr('xl', false, true), tr(' (≥ 1200px).')], { firstLine: true }),
        bodyPara([tr('Komponen-komponen utama Bootstrap yang digunakan dalam praktikum ini antara lain: (1) '), tr('Navbar', false, true), tr(', komponen navigasi responsif yang secara otomatis menjadi hamburger menu pada layar kecil; (2) '), tr('Card', false, true), tr(', wadah konten yang fleksibel dengan berbagai opsi header, body, footer, dan gambar; (3) '), tr('Form', false, true), tr(', elemen formulir yang sudah diberikan styling dan validasi bawaan; (4) '), tr('Table', false, true), tr(', tabel dengan gaya striped, hover, dan bordered; serta (5) '), tr('Modal', false, true), tr(', jendela dialog pop-up yang diaktifkan melalui trigger JavaScript Bootstrap.')], { firstLine: true }),

        // C. HASIL DAN PEMBAHASAN
        new Paragraph({ children: [tr('C. Hasil dan Pembahasan', true)], spacing: { before: 240, after: 120 } }),
        bodyPara([tr('Berdasarkan tugas praktikum yang diberikan, berikut adalah penjelasan, implementasi kode, dan hasil dari masing-masing tugas:')]),

        // TUGAS 1
        new Paragraph({ children: [tr('1. Halaman Navbar dan Card dengan Bootstrap')], spacing: { before: 120, after: 60 }, indent: { left: 360 } }),
        bodyPara([tr('Tugas pertama mengharuskan pembuatan halaman web menggunakan komponen Navbar dan Card dari Bootstrap. Halaman ini menampilkan navigasi responsif di bagian atas dan tiga buah card yang disusun dalam sistem grid Bootstrap.', false)], { indent: { left: 360 } }),

        new Paragraph({ children: [tr('a. Implementasi Navbar', false)], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Navbar Bootstrap diimplementasikan menggunakan kelas '), tr('navbar-expand-lg', false, true), tr(' sehingga menu akan runtuh menjadi tombol toggler pada layar yang lebih kecil dari breakpoint '), tr('lg', false, true), tr('. Kelas '), tr('bg-body-tertiary', false, true), tr(' memberikan latar belakang yang adaptif sesuai tema.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<nav class="navbar navbar-expand-lg bg-body-tertiary">',
          '  <div class="container-fluid">',
          '    <a class="navbar-brand" href="#">Navbar</a>',
          '    <button class="navbar-toggler" type="button"',
          '      data-bs-toggle="collapse"',
          '      data-bs-target="#navbarNav">',
          '      <span class="navbar-toggler-icon"></span>',
          '    </button>',
          '    <div class="collapse navbar-collapse" id="navbarNav">',
          '      <ul class="navbar-nav">',
          '        <li class="nav-item">',
          '          <a class="nav-link active" href="#">Home</a>',
          '        </li>',
          '        ...',
          '      </ul>',
          '    </div>',
          '  </div>',
          '</nav>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Navbar menggunakan toggler yang tersembunyi secara default dan muncul pada layar kecil. Atribut '), tr('data-bs-toggle="collapse"', false, true), tr(' dan '), tr('data-bs-target="#navbarNav"', false, true), tr(' menghubungkan tombol toggler dengan elemen menu yang kolapsibel.')], { indent: { left: 720 } }),

        new Paragraph({ children: [tr('b. Implementasi Card Grid', false)], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Tiga buah card disusun menggunakan sistem grid Bootstrap dengan kelas '), tr('row-cols-1 row-cols-md-2 row-cols-lg-3', false, true), tr(' sehingga jumlah kolom menyesuaikan ukuran layar secara otomatis. Kelas '), tr('h-100', false, true), tr(' pada card memastikan seluruh card memiliki tinggi yang sama.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">',
          '  <div class="col">',
          '    <div class="card h-100">',
          '      <img src="https://picsum.photos/800/400"',
          '           class="card-img-top" alt="..." />',
          '      <div class="card-body">',
          '        <h5 class="card-title">Card title</h5>',
          '        <p class="card-text">This is a wider card with',
          '          supporting text below...</p>',
          '      </div>',
          '      <div class="card-footer">',
          '        <small class="text-body-secondary">',
          '          Last updated 3 mins ago</small>',
          '      </div>',
          '    </div>',
          '  </div>',
          '  ...',
          '</div>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Penggunaan kelas '), tr('g-4', false, true), tr(' memberikan jarak (gutter) antar card. Gambar diambil secara dinamis dari layanan picsum.photos. Kelas '), tr('h-100', false, true), tr(' memastikan card yang memiliki konten berbeda-beda tetap sama tingginya dalam satu baris, sehingga tampilan lebih rapi dan konsisten.')], { indent: { left: 720 } }),

        // TUGAS 2
        new Paragraph({ children: [tr('2. Formulir Pendaftaran Mahasiswa Baru')], spacing: { before: 240, after: 60 }, indent: { left: 360 } }),
        bodyPara([tr('Tugas kedua adalah membuat formulir pendaftaran mahasiswa baru menggunakan komponen form Bootstrap yang dilengkapi dengan validasi visual dan alert sukses.')], { indent: { left: 360 } }),

        new Paragraph({ children: [tr('a. Implementasi Form dengan Validasi')], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Form Bootstrap menggunakan kelas '), tr('is-valid', false, true), tr(' dan '), tr('is-invalid', false, true), tr(' untuk memberikan feedback visual langsung kepada pengguna. Kelas '), tr('valid-feedback', false, true), tr(' dan '), tr('invalid-feedback', false, true), tr(' digunakan untuk menampilkan pesan validasi yang sesuai.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<div class="row mb-3">',
          '  <div class="col-md-6">',
          '    <label for="namaLengkap" class="form-label">',
          '      Nama Lengkap</label>',
          '    <input type="text" class="form-control is-valid"',
          '      id="namaLengkap" value="John Doe" required />',
          '    <div class="valid-feedback">Nama terlihat valid!</div>',
          '  </div>',
          '  <div class="col-md-6 mt-3 mt-md-0">',
          '    <label for="nim" class="form-label">NIM</label>',
          '    <input type="text" class="form-control is-invalid"',
          '      id="nim" value="123" required />',
          '    <div class="invalid-feedback">',
          '      NIM harus berisi minimal 9 digit angka.</div>',
          '  </div>',
          '</div>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Field Nama Lengkap ditandai '), tr('is-valid', false, true), tr(' karena sudah terisi dengan benar, sementara field NIM ditandai '), tr('is-invalid', false, true), tr(' karena belum memenuhi syarat panjang. Sistem validasi visual ini memberikan feedback langsung yang membantu pengguna mengetahui status inputannya sebelum form dikirimkan.')], { indent: { left: 720 } }),

        new Paragraph({ children: [tr('b. Implementasi Alert dan Submit Handler')], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Alert sukses ditampilkan menggunakan komponen Bootstrap Alert yang awalnya disembunyikan dengan kelas '), tr('d-none', false, true), tr('. Ketika form berhasil disubmit, JavaScript akan menghapus kelas tersebut sehingga alert muncul.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML & JavaScript):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<div class="alert alert-success alert-dismissible',
          '     fade show d-none" id="successAlert">',
          '  <strong>Berhasil!</strong> Formulir pendaftaran',
          '  berhasil disimpan.',
          '  <button type="button" class="btn-close"',
          '    data-bs-dismiss="alert"></button>',
          '</div>',
          '',
          '// JavaScript',
          'const formRegistration = document.querySelector("form");',
          'const successAlert = document.getElementById("successAlert");',
          '',
          'formRegistration.addEventListener("submit", function(e) {',
          '  e.preventDefault();',
          '  successAlert.classList.remove("d-none");',
          '  window.scrollTo(0, 0);',
          '});',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Event listener '), tr('submit', false, true), tr(' pada form mencegah perilaku default pengiriman form ('), tr('e.preventDefault()', false, true), tr('), lalu menampilkan alert sukses dengan menghapus kelas '), tr('d-none', false, true), tr('. Halaman juga di-scroll kembali ke atas agar pengguna dapat melihat pesan berhasil tersebut.')], { indent: { left: 720 } }),

        // TUGAS 3
        new Paragraph({ children: [tr('3. Dashboard Nilai Mahasiswa dengan Tabel dan Modal')], spacing: { before: 240, after: 60 }, indent: { left: 360 } }),
        bodyPara([tr('Tugas ketiga adalah membuat dashboard nilai mahasiswa yang menampilkan informasi profil, statistik akademik dalam card ringkasan, daftar nilai dalam tabel, serta detail mata kuliah dalam modal Bootstrap.')], { indent: { left: 360 } }),

        new Paragraph({ children: [tr('a. Implementasi Card Profil dan Statistik')], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Profil mahasiswa ditampilkan menggunakan card dengan layout flex ('), tr('d-flex align-items-center gap-3', false, true), tr(') yang menggabungkan foto avatar, nama, NIM, dan badge status. Tiga card statistik disusun dalam grid responsif.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<div class="card mb-4 shadow-sm border-0">',
          '  <div class="card-body d-flex align-items-center gap-3">',
          '    <img src="https://ui-avatars.com/api/?name=Gayuh"',
          '         class="rounded-circle border"',
          '         width="80" height="80" />',
          '    <div>',
          '      <h4 class="mb-1">Gayuh Mukti Aji</h4>',
          '      <p class="text-muted mb-1">NIM: 29291098371 | TRPL</p>',
          '      <span class="badge bg-success rounded-pill px-3 py-2">',
          '        Mahasiswa Aktif</span>',
          '    </div>',
          '  </div>',
          '</div>',
          '',
          '<div class="row row-cols-1 row-cols-md-3 g-4 mb-4">',
          '  <div class="col">',
          '    <div class="card h-100 shadow-sm border-0">',
          '      <div class="card-body d-flex align-items-center gap-3">',
          '        <div class="display-5 text-primary">&#127891;</div>',
          '        <div>',
          '          <h6 class="text-muted text-uppercase fw-bold">',
          '            Total SKS</h6>',
          '          <h3 class="fw-bold">112</h3>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '  ...',
          '</div>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Kelas '), tr('shadow-sm border-0', false, true), tr(' memberikan tampilan card yang modern dan bersih tanpa border. Badge '), tr('bg-success rounded-pill', false, true), tr(' pada status mahasiswa memberikan indikator visual yang jelas. Tiga card statistik (Total SKS, IPK, Mata Kuliah Lulus) menggunakan grid '), tr('row-cols-md-3', false, true), tr(' agar tersusun tiga kolom pada layar medium ke atas.')], { indent: { left: 720 } }),

        new Paragraph({ children: [tr('b. Implementasi Tabel Nilai')], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Daftar nilai mata kuliah ditampilkan dalam tabel Bootstrap dengan kelas '), tr('table-hover table-striped', false, true), tr(' untuk memudahkan pembacaan data. Kolom Nilai Huruf menggunakan badge dengan warna yang berbeda sesuai predikat nilai.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<table class="table table-hover table-striped',
          '       align-middle mb-0">',
          '  <thead class="table-dark">',
          '    <tr>',
          '      <th class="text-center">No</th>',
          '      <th>Mata Kuliah</th>',
          '      <th class="text-center">SKS</th>',
          '      <th class="text-center">Nilai Angka</th>',
          '      <th class="text-center">Nilai Huruf</th>',
          '      <th class="text-center">Aksi</th>',
          '    </tr>',
          '  </thead>',
          '  <tbody>',
          '    <tr>',
          '      <td class="text-center">1</td>',
          '      <td>Pemrograman Web</td>',
          '      <td class="text-center">3</td>',
          '      <td class="text-center">92</td>',
          '      <td class="text-center">',
          '        <span class="badge bg-success px-3 py-2">A</span>',
          '      </td>',
          '      <td class="text-center">',
          '        <button class="btn btn-sm btn-outline-primary"',
          '          data-bs-toggle="modal"',
          '          data-bs-target="#modalDetail1">Detail</button>',
          '      </td>',
          '    </tr>',
          '    ...',
          '  </tbody>',
          '</table>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Tabel menggunakan kelas '), tr('table-striped', false, true), tr(' untuk memberikan warna selang-seling pada baris sehingga lebih mudah dibaca, dan '), tr('table-hover', false, true), tr(' untuk efek highlight saat kursor diarahkan ke baris. Badge nilai huruf menggunakan kode warna: hijau (A/Lulus), biru (B), kuning (C/Bersyarat), dan merah (D dan E/Tidak Lulus).')], { indent: { left: 720 } }),

        new Paragraph({ children: [tr('c. Implementasi Modal Detail Mata Kuliah')], spacing: { before: 120, after: 60 }, indent: { left: 720 } }),
        bodyPara([tr('Setiap baris pada tabel memiliki tombol "Detail" yang memicu modal Bootstrap. Modal menampilkan informasi lengkap mata kuliah menggunakan komponen '), tr('list-group', false, true), tr(' di dalam '), tr('modal-body', false, true), tr('.')], { indent: { left: 720 } }),
        new Paragraph({ children: [tr('Code snippet (HTML):')], spacing: { before: 60, after: 60 }, indent: { left: 720 } }),
        codeBlockLines([
          '<div class="modal fade" id="modalDetail1"',
          '     tabindex="-1" aria-hidden="true">',
          '  <div class="modal-dialog modal-dialog-centered">',
          '    <div class="modal-content">',
          '      <div class="modal-header">',
          '        <h5 class="modal-title">Informasi Mata Kuliah</h5>',
          '        <button type="button" class="btn-close"',
          '          data-bs-dismiss="modal"></button>',
          '      </div>',
          '      <div class="modal-body">',
          '        <ul class="list-group list-group-flush">',
          '          <li class="list-group-item">',
          '            <strong>Mata Kuliah:</strong> Pemrograman Web',
          '          </li>',
          '          <li class="list-group-item">',
          '            <strong>Status:</strong>',
          '            <span class="text-success fw-bold">LULUS</span>',
          '          </li>',
          '          ...',
          '        </ul>',
          '      </div>',
          '      <div class="modal-footer">',
          '        <button class="btn btn-secondary"',
          '          data-bs-dismiss="modal">Tutup</button>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>',
        ]),
        bodyPara([tr('Pembahasan: ', false, true), tr('Modal diaktifkan oleh atribut '), tr('data-bs-toggle="modal"', false, true), tr(' dan '), tr('data-bs-target="#modalDetail1"', false, true), tr(' pada tombol tanpa memerlukan penulisan kode JavaScript tambahan. Kelas '), tr('modal-dialog-centered', false, true), tr(' memastikan modal muncul di tengah layar secara vertikal. Setiap mata kuliah memiliki ID modal yang unik ('), tr('modalDetail1', false, true), tr(' hingga '), tr('modalDetail5', false, true), tr(') sehingga setiap tombol memicu modal yang berisi informasi yang sesuai.')], { indent: { left: 720 } }),

        // D. KESIMPULAN
        new Paragraph({ children: [tr('D. Kesimpulan', true)], spacing: { before: 240, after: 120 } }),
        bodyPara([tr('Berdasarkan praktikum yang telah dilakukan, dapat disimpulkan bahwa:')]),
        numberedItem('Bootstrap secara signifikan mempercepat proses pengembangan antarmuka web dengan menyediakan komponen-komponen siap pakai (Navbar, Card, Form, Table, Modal) yang sudah dirancang dengan baik secara visual dan fungsional.', 1),
        numberedItem('Sistem grid Bootstrap yang berbasis 12 kolom dengan breakpoint responsif memungkinkan layout halaman menyesuaikan diri secara otomatis terhadap berbagai ukuran layar, mulai dari mobile hingga desktop, hanya dengan penambahan kelas CSS yang tepat.', 2),
        numberedItem('Validasi form Bootstrap memberikan feedback visual yang jelas dan intuitif kepada pengguna melalui kelas is-valid dan is-invalid, sehingga pengalaman pengisian formulir menjadi lebih baik.', 3),
        numberedItem('Komponen interaktif seperti Modal dan Alert dapat digunakan tanpa menulis kode JavaScript yang kompleks, cukup dengan memanfaatkan atribut data-bs-* yang disediakan oleh Bootstrap.', 4),

        // E. DAFTAR PUSTAKA
        new Paragraph({ children: [tr('E. Daftar Pustaka', true)], spacing: { before: 240, after: 120 } }),
        new Paragraph({
          children: [
            tr('[1] Bootstrap, "Bootstrap v5.3 Documentation," getbootstrap.com, 2024. [Online]. Tersedia: '),
            new ExternalHyperlink({
              link: 'https://getbootstrap.com/docs/5.3',
              children: [new TextRun({ text: 'https://getbootstrap.com/docs/5.3', style: 'Hyperlink', font: 'Times New Roman', size: 24 })],
            }),
            tr('. [Diakses: 24 Maret 2026].'),
          ],
          spacing: { line: 480, lineRule: 'auto', before: 0, after: 60 },
          indent: { left: 720, hanging: 720 },
        }),
        new Paragraph({
          children: [tr('[2] A. C. Emcha, "5. Bootstrap," Modul Praktikum Pemrograman Web, Program Studi D-IV Teknologi Rekayasa Perangkat Lunak, Universitas Gadjah Mada, Yogyakarta, 2026.')],
          spacing: { line: 480, lineRule: 'auto', before: 0, after: 60 },
          indent: { left: 720, hanging: 720 },
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('Laporan_Praktikum_P6.docx', buffer);
  console.log('Done!');
});