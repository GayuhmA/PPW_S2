<?php
include_once("config.php");
requireLogin();

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit();
}

$id = (int) $_GET['id'];
$result = mysqli_query($conn, "SELECT * FROM mahasiswa WHERE id=$id");

if (mysqli_num_rows($result) == 0) {
    header("Location: index.php");
    exit();
}

$row = mysqli_fetch_assoc($result);
$current_foto = $row['foto'];
$errors = [];

if (isset($_POST['update'])) {
    $nim = mysqli_real_escape_string($conn, trim($_POST['nim']));
    $nama = mysqli_real_escape_string($conn, trim($_POST['nama']));
    $jurusan = mysqli_real_escape_string($conn, trim($_POST['jurusan']));
    $email = mysqli_real_escape_string($conn, trim($_POST['email']));
    $alamat = mysqli_real_escape_string($conn, trim($_POST['alamat']));
    $foto_filename = $current_foto;

    if (empty($nim)) {
        $errors[] = "NIM tidak boleh kosong";
    } else {
        if (!is_numeric($nim)) {
            $errors[] = "NIM hanya boleh berisi angka";
        }

        if (strlen($nim) < 8 || strlen($nim) > 12) {
            $errors[] = "Panjang NIM harus 8 sampai 12 karakter";
        }
    }

    if (empty($nama)) {
        $errors[] = "Nama tidak boleh kosong";
    }

    if (empty($jurusan)) {
        $errors[] = "Jurusan tidak boleh kosong";
    }

    if (empty($email)) {
        $errors[] = "Email tidak boleh kosong";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Format email tidak valid";
    }

    $check = mysqli_query($conn, "SELECT nim FROM mahasiswa WHERE nim='$nim' AND id!=$id");
    if (mysqli_num_rows($check) > 0) {
        $errors[] = "NIM sudah digunakan mahasiswa lain";
    }

    if (empty($errors)) {
        if (isset($_POST['hapus_foto']) && $_POST['hapus_foto'] == '1') {
            if ($current_foto) {
                deleteFile($current_foto);
            }
            $foto_filename = null;
        }

        if (!empty($_FILES['foto']['name'])) {
            $upload = uploadFile($_FILES['foto']);
            if ($upload['success']) {
                if ($foto_filename) {
                    deleteFile($foto_filename);
                }
                $foto_filename = $upload['filename'];
            } else {
                $errors[] = $upload['message'];
            }
        }
    }

    if (empty($errors)) {
        $foto_sql = $foto_filename ? "'$foto_filename'" : "NULL";
        $sql = "UPDATE mahasiswa SET
                nim='$nim',
                nama='$nama',
                jurusan='$jurusan',
                email='$email',
                alamat='$alamat',
                foto=$foto_sql
                WHERE id=$id";

        if (mysqli_query($conn, $sql)) {
            $_SESSION['message'] = "Data berhasil diperbarui!";
            header("Location: index.php");
            exit();
        } else {
            $errors[] = "Error: " . mysqli_error($conn);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Mahasiswa</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; }
        .container { width: 540px; max-width: 92%; margin: 30px auto; background: white; padding: 22px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        h2 { margin-top: 0; }
        label { display: block; margin-top: 14px; font-weight: bold; }
        input, textarea { width: 100%; padding: 10px; box-sizing: border-box; margin-top: 6px; border: 1px solid #ccc; border-radius: 4px; }
        input[type="checkbox"] { width: auto; }
        textarea { min-height: 90px; resize: vertical; }
        small { display: block; margin-top: 5px; color: #555; }
        .required { color: #dc2626; }
        .current-photo { width: 110px; height: 110px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; margin-top: 8px; }
        .btn { display: inline-block; padding: 9px 12px; color: white; background: #2563eb; border: 0; border-radius: 4px; text-decoration: none; cursor: pointer; margin-top: 16px; }
        .btn-secondary { background: #64748b; }
        .alert { padding: 10px; margin-bottom: 12px; border-radius: 4px; }
        .danger { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Edit Data Mahasiswa</h2>

        <?php if (!empty($errors)): ?>
            <div class="alert danger">
                <?php foreach ($errors as $error): ?>
                    <div><?= h($error) ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <form action="edit.php?id=<?= $id ?>" method="POST" enctype="multipart/form-data">
            <label>Foto Saat Ini</label>
            <?php if ($current_foto): ?>
                <img src="uploads/mahasiswa/<?= h($current_foto) ?>" class="current-photo" alt="Foto">
                <label>
                    <input type="checkbox" name="hapus_foto" value="1">
                    Hapus foto
                </label>
            <?php else: ?>
                <small>Belum ada foto</small>
            <?php endif; ?>

            <label>Ganti Foto</label>
            <input type="file" name="foto" accept="image/*">
            <small>Format: JPG, PNG, GIF | Maks: 5MB</small>

            <label>NIM <span class="required">*</span></label>
            <input type="text" name="nim" required value="<?= h($_POST['nim'] ?? $row['nim']) ?>">

            <label>Nama Lengkap <span class="required">*</span></label>
            <input type="text" name="nama" required value="<?= h($_POST['nama'] ?? $row['nama']) ?>">

            <label>Jurusan <span class="required">*</span></label>
            <input type="text" name="jurusan" required value="<?= h($_POST['jurusan'] ?? $row['jurusan']) ?>">

            <label>Email <span class="required">*</span></label>
            <input type="email" name="email" required value="<?= h($_POST['email'] ?? $row['email']) ?>">

            <label>Alamat</label>
            <textarea name="alamat"><?= h($_POST['alamat'] ?? $row['alamat']) ?></textarea>

            <button type="submit" name="update" class="btn">Update Data</button>
            <a href="index.php" class="btn btn-secondary">Batal</a>
        </form>
    </div>
</body>
</html>
