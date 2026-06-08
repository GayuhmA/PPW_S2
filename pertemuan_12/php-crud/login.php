<?php
include_once("config.php");

if (isLoggedIn()) {
    header("Location: index.php");
    exit();
}

$error = "";

if (isset($_POST['login'])) {
    $username = mysqli_real_escape_string($conn, trim($_POST['username']));
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE username='$username' OR email='$username'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['full_name'] = $user['full_name'];

            header("Location: index.php");
            exit();
        } else {
            $error = "Username atau password salah!";
        }
    } else {
        $error = "Username atau password salah!";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; }
        .box { width: 360px; max-width: 90%; margin: 80px auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
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
        <h2>Login</h2>

        <?php if ($error): ?>
            <div class="alert danger"><?= h($error) ?></div>
        <?php endif; ?>

        <?php if (isset($_SESSION['message'])): ?>
            <div class="alert success">
                <?= h($_SESSION['message']); unset($_SESSION['message']); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <label>Username / Email</label>
            <input type="text" name="username" required>

            <label>Password</label>
            <input type="password" name="password" required>

            <button type="submit" name="login">Login</button>
        </form>

        <p>Belum punya akun? <a href="register.php">Register</a></p>
    </div>
</body>
</html>
