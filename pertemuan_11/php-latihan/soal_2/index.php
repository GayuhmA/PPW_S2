<?php 
include("hitung.php");

$kategori = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $berat = $_POST['berat'];
    $tinggi = $_POST['tinggi'];
    
    $kategori = hitungIMT($berat, $tinggi);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h2>Kalkulator IMT</h2>
    <form method="POST" action="">
        <label for="berat">Berat Badan:</label><br>
        <input type="number" step="any" name="berat" id="berat" required><br><br>
        
        <label for="tinggi">Tinggi Badan:</label><br>
        <input type="number" step="any" name="tinggi" id="tinggi" required><br><br>
        
        <button type="submit">Hitung</button>
    </form>

    <?php if ($kategori != ""): ?>
        <hr>
        <h3>Hasil: <?php echo $kategori; ?></h3>
    <?php endif; ?>
</body>
</html>