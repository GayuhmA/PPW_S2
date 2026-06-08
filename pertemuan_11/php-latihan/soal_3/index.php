<?php
include('waktu.php');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <h2>Informasi Waktu Sekarang</h2>
    
    <table border="1" cellpadding="8" cellspacing="0">
        <tr>
            <td><b>Bulan Sekarang</b></td>
            <td><?php echo $nama_bulan; ?></td>
        </tr>
        <tr>
            <td><b>Tanggal Hari Ini</b></td>
            <td><?php echo $tanggal_hari_ini; ?></td>
        </tr>
        <tr>
            <td><b>Total Hari di Bulan Ini</b></td>
            <td><?php echo $total_hari_bulan_ini; ?> hari</td>
        </tr>
        <tr>
            <td><b>Sisa Hari Tersisa</b></td>
            <td><?php echo $hari_tersisa; ?> hari lagi</td>
        </tr>
    </table>

</body>
</html>