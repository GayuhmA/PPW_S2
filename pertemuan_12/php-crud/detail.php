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
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Mahasiswa</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; }
        .container { width: 680px; max-width: 92%; margin: 30px auto; background: white; padding: 22px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        h2 { margin-top: 0; }
        .photo-big { width: 220px; height: 220px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
        .no-photo { width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: #555; border-radius: 8px; }
        .grid { display: grid; grid-template-columns: 180px 1fr; gap: 10px; margin-top: 18px; }
        .label { font-weight: bold; color: #374151; }
        .btn { display: inline-block; padding: 9px 12px; color: white; background: #2563eb; border-radius: 4px; text-decoration: none; margin-top: 18px; }
        .btn-secondary { background: #64748b; }
        .btn-warning { background: #f59e0b; }
        @media (max-width: 560px) {
            .grid { grid-template-columns: 1fr; gap: 4px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Detail Mahasiswa</h2>

        <?php if ($row['foto']): ?>
            <img src="uploads/mahasiswa/<?= h($row['foto']) ?>" class="photo-big" alt="Foto Mahasiswa">
        <?php else: ?>
            <div class="no-photo">Tidak ada foto</div>
        <?php endif; ?>

        <div class="grid">
            <div class="label">NIM</div>
            <div><?= h($row['nim']) ?></div>

            <div class="label">Nama</div>
            <div><?= h($row['nama']) ?></div>

            <div class="label">Jurusan</div>
            <div><?= h($row['jurusan']) ?></div>

            <div class="label">Email</div>
            <div><?= h($row['email']) ?></div>

            <div class="label">Alamat</div>
            <div><?= nl2br(h($row['alamat'])) ?: '-' ?></div>

            <div class="label">Tanggal Daftar</div>
            <div><?= h($row['created_at']) ?></div>
        </div>

        <a href="index.php" class="btn btn-secondary">Kembali</a>
        <a href="edit.php?id=<?= $row['id'] ?>" class="btn btn-warning">Edit</a>
    </div>
</body>
</html>
