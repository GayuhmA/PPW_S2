<?php
function hitungIMT($berat, $tinggi){
    if ($tinggi > 3) {
        $tinggi = $tinggi / 100;
    }
    $result = $berat / ($tinggi * $tinggi);

    if($result < 18.5){
        return "Kurus";
    } else if ($result < 22.9){
        return "Normal";
    } else if ($result < 24.9){
        return "Gemuk";
    } else {
        return "Obesitas";
    }
}
?>