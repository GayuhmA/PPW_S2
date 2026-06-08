<?php
include_once("config.php");
requireLogin();

$limit = 5;
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
if ($page < 1) {
    $page = 1;
}

$search = isset($_GET['search']) ? trim($_GET['search']) : "";
$search_sql = mysqli_real_escape_string($conn, $search);
$where = "";

if ($search_sql != "") {
    $where = "WHERE nim LIKE '%$search_sql%'
              OR nama LIKE '%$search_sql%'
              OR jurusan LIKE '%$search_sql%'
              OR email LIKE '%$search_sql%'";
}

$count_result = mysqli_query($conn, "SELECT COUNT(*) AS total FROM mahasiswa $where");
$total_data = mysqli_fetch_assoc($count_result)['total'];
$total_pages = ceil($total_data / $limit);

if ($total_pages < 1) {
    $total_pages = 1;
}

if ($page > $total_pages) {
    $page = $total_pages;
}

$offset = ($page - 1) * $limit;
$result = mysqli_query($conn, "SELECT * FROM mahasiswa $where ORDER BY id DESC LIMIT $limit OFFSET $offset");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Mahasiswa</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; color: #222; }
        .container { width: 94%; max-width: 1100px; margin: 30px auto; background: white; padding: 22px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        .top { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
        h2 { margin: 0; }
        .user { color: #555; margin-top: 6px; }
        .actions, .search { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .search { margin: 20px 0; }
        input[type="text"] { padding: 9px; border: 1px solid #ccc; border-radius: 4px; min-width: 240px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: middle; }
        th { background: #e5e7eb; }
        .photo { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
        .no-photo { width: 60px; height: 60px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; color: #555; border-radius: 4px; font-size: 12px; }
        .btn { display: inline-block; padding: 8px 11px; margin: 2px; color: white; background: #2563eb; border: 0; border-radius: 4px; text-decoration: none; cursor: pointer; }
        .btn-secondary { background: #64748b; }
        .btn-warning { background: #f59e0b; }
        .btn-danger { background: #dc2626; }
        .btn-info { background: #0891b2; }
        .alert { padding: 10px; margin: 15px 0; border-radius: 4px; }
        .success { background: #dcfce7; color: #166534; }
        .danger { background: #fee2e2; color: #991b1b; }
        .pagination { margin-top: 18px; }
        .pagination a { display: inline-block; padding: 8px 12px; margin: 2px; background: #e5e7eb; color: #111827; text-decoration: none; border-radius: 4px; }
        .pagination a.current { background: #2563eb; color: white; }
        @media (max-width: 760px) {
            table { display: block; overflow-x: auto; }
            input[type="text"] { min-width: 0; width: 100%; box-sizing: border-box; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top">
            <div>
                <h2>Data Mahasiswa</h2>
                <div class="user">Login sebagai: <?= h($_SESSION['full_name']) ?></div>
            </div>
            <div class="actions">
                <a href="tambah.php" class="btn">Tambah Data</a>
                <a href="logout.php" class="btn btn-secondary">Logout</a>
            </div>
        </div>

        <?php if (isset($_SESSION['message'])): ?>
            <div class="alert success">
                <?= h($_SESSION['message']); unset($_SESSION['message']); ?>
            </div>
        <?php endif; ?>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert danger">
                <?= h($_SESSION['error']); unset($_SESSION['error']); ?>
            </div>
        <?php endif; ?>

        <form class="search" method="GET" action="index.php">
            <input type="text" name="search" placeholder="Cari NIM, nama, jurusan, email" value="<?= h($search) ?>">
            <button type="submit" class="btn">Cari</button>
            <a href="index.php" class="btn btn-secondary">Reset</a>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Foto</th>
                    <th>NIM</th>
                    <th>Nama</th>
                    <th>Jurusan</th>
                    <th>Email</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if (mysqli_num_rows($result) > 0): ?>
                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                        <tr>
                            <td>
                                <?php if ($row['foto']): ?>
                                    <img src="uploads/mahasiswa/<?= h($row['foto']) ?>" class="photo" alt="Foto">
                                <?php else: ?>
                                    <div class="no-photo">N/A</div>
                                <?php endif; ?>
                            </td>
                            <td><?= h($row['nim']) ?></td>
                            <td><?= h($row['nama']) ?></td>
                            <td><?= h($row['jurusan']) ?></td>
                            <td><?= h($row['email']) ?></td>
                            <td>
                                <a href="detail.php?id=<?= $row['id'] ?>" class="btn btn-info">Detail</a>
                                <a href="edit.php?id=<?= $row['id'] ?>" class="btn btn-warning">Edit</a>
                                <a href="hapus.php?id=<?= $row['id'] ?>" class="btn btn-danger" onclick="return confirm('Yakin hapus data ini?')">Hapus</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="6" style="text-align:center;">Data tidak ditemukan</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="pagination">
            <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                <a href="?page=<?= $i ?>&search=<?= urlencode($search) ?>" class="<?= $i == $page ? 'current' : '' ?>"><?= $i ?></a>
            <?php endfor; ?>
        </div>
    </div>
</body>
</html>
