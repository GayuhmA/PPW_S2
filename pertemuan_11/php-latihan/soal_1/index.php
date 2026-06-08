<?php 
include('data.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th colspan="2" align="left">Biodata Diri</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><b>Nama</b></td>
                <td><?php echo $nama; ?></td>
            </tr>
            <tr>
                <td><b>NIM</b></td>
                <td><?php echo $nim; ?></td>
            </tr>
            <tr>
                <td><b>Program Studi</b></td>
                <td><?php echo $prodi; ?></td>
            </tr>
            <tr>
                <td><b>Asal Kota</b></td>
                <td><?php echo $asal; ?></td>
            </tr>
        </tbody>
    </table>
</body>
</html>