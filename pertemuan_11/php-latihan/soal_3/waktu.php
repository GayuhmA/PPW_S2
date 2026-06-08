<?php
date_default_timezone_set('Asia/Jakarta');

$bulan_sekarang = date('F'); 

$bulan_indo = [
    'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
    'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
    'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
    'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember'
];
$nama_bulan = $bulan_indo[$bulan_sekarang];

$tanggal_hari_ini = date('j');

$total_hari_bulan_ini = date('t');

$hari_tersisa = $total_hari_bulan_ini - $tanggal_hari_ini;
?>