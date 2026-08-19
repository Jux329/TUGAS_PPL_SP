<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/menu');

// 1. Tambahkan ->name('menu')
Route::get('/menu', function () {
    return view('customer.menu');
})->name('menu');

// 2. Tambahkan ->name('pesanan')
Route::get('/pesanan', function () {
    return view('customer.pesanan');
})->name('pesanan');

// 3. Tambahkan ->name('keranjang')
Route::get('/keranjang', function () {
    return view('customer.keranjang');
})->name('keranjang');
