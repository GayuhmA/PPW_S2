<?php
include_once("config.php");

if (isLoggedIn()) {
    header("Location: index.php");
    exit();
}

$errors = [];
$success = "";

if (isset($_POST['register'])) {
    $username = mysqli_real_escape_string($conn, trim($_POST['username']));
    $email = mysqli_real_escape_string($conn, trim($_POST['email']));
    $full_name = mysqli_real_escape_string($conn, trim($_POST['full_name']));
    $password = $_POST['password'];
    $confirm = $_POST['confirm_password'];

    if (empty($username)) {
        $errors[] = "Username tidak boleh kosong";
    }

    if (empty($email)) {
        $errors[] = "Email tidak boleh kosong";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Format email tidak valid";
    }

    if (empty($full_name)) {
        $errors[] = "Nama lengkap tidak boleh kosong";
    }

    if (strlen($password) < 6) {
        $errors[] = "Password minimal 6 karakter";
    }

    if ($password !== $confirm) {
        $errors[] = "Konfirmasi password tidak cocok";
    }

    $check = mysqli_query($conn, "SELECT id FROM users WHERE username='$username' OR email='$email'");
    if (mysqli_num_rows($check) > 0) {
        $errors[] = "Username atau email sudah terdaftar";
    }

    if (empty($errors)) {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, email, password, full_name)
                VALUES ('$username', '$email', '$hashed', '$full_name')";

        if (mysqli_query($conn, $sql)) {
            $success = "Registrasi berhasil! Silakan login.";
            $_POST = [];
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
    <title>Register</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; }
        .box { width: 420px; max-width: 90%; margin: 40px auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        h2 { margin-top: 0; text-align: center; }
        label { display: block; margin-top: 14px; font-weight: bold; }
        input { width: 100%; padding: 10px; box-sizing: border-box; margin-top: 6px; border: 1px solid #ccc; border-radius: 4px; }
        button { width: 100%; margin-top: 18px; padding: 10px; border: 0; background: #2563eb; color: white; border-radius: 4px; cursor: pointer; }
        .alert { padding: 10px; margin-bottom: 12px; border-radius: 4px; }
        .danger { background: #fee2e2; color: #991b1b; }
        .success { background: #dcfce7; color: #166534; }
        p { text-align: center; }
        a { color: #2563eb; text-decoration: none; }
    </style>
</head>
<body>
    <div class="box">
        <h2>Register</h2>

        <?php if (!empty($errors)): ?>
            <div class="alert danger">
                <?php foreach ($errors as $error): ?>
                    <div><?= h($error) ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert success"><?= h($success) ?></div>
        <?php endif; ?>

        <form method="POST" action="register.php">
            <label>Username</label>
            <input type="text" name="username" required value="<?= h($_POST['username'] ?? '') ?>">

            <label>Email</label>
            <input type="email" name="email" required value="<?= h($_POST['email'] ?? '') ?>">

            <label>Nama Lengkap</label>
            <input type="text" name="full_name" required value="<?= h($_POST['full_name'] ?? '') ?>">

            <label>Password</label>
            <input type="password" name="password" required>

            <label>Konfirmasi Password</label>
            <input type="password" name="confirm_password" required>

            <button type="submit" name="register">Register</button>
        </form>

        <p>Sudah punya akun? <a href="login.php">Login</a></p>
    </div>
</body>
</html>
