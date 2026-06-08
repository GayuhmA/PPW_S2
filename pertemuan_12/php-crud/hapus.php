<?php
include_once("config.php");
requireLogin();

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];

    $result = mysqli_query($conn, "SELECT foto FROM mahasiswa WHERE id=$id");

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $foto = $row['foto'];

        if (mysqli_query($conn, "DELETE FROM mahasiswa WHERE id=$id")) {
            if ($foto) {
                deleteFile($foto);
            }
            $_SESSION['message'] = "Data berhasil dihapus!";
        } else {
            $_SESSION['error'] = "Error: " . mysqli_error($conn);
        }
    }
}

header("Location: index.php");
exit();
?>
