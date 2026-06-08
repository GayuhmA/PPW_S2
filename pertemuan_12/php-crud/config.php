<?php
session_start();

$host = "localhost";
$username = "root";
$password = "";
$database = "praktikum_crud";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}

function requireLogin()
{
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit();
    }
}

function h($text)
{
    return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
}

function uploadFile($file, $target_dir = "uploads/mahasiswa/")
{
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Gagal upload file.'];
    }

    $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

    if ($file["size"] > 5000000) {
        return ['success' => false, 'message' => 'File terlalu besar. Maks 5MB.'];
    }

    $allowed = ["jpg", "jpeg", "png", "gif"];
    if (!in_array($imageFileType, $allowed)) {
        return ['success' => false, 'message' => 'Format tidak didukung. Gunakan JPG, PNG, atau GIF.'];
    }

    $new_filename = uniqid("foto_", true) . "." . $imageFileType;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        return ['success' => true, 'filename' => $new_filename];
    }

    return ['success' => false, 'message' => 'Gagal upload file.'];
}

function deleteFile($filename, $dir = "uploads/mahasiswa/")
{
    if ($filename && file_exists($dir . $filename)) {
        unlink($dir . $filename);
    }
}
?>
