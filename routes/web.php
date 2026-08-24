<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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
    $cart = session('cart', []);

    return view('customer.keranjang', [
        'cart' => $cart,
        'total' => collect($cart)->sum(fn (array $item) => $item['price'] * $item['quantity']),
    ]);
})->name('keranjang');

Route::post('/keranjang/tambah', function (Request $request) {
    $products = [
        'sei-sapi' => ['name' => "Se'i Sapi Sambal Lu'at", 'price' => 48, 'image' => 'images/sei-sapi-sambal-luat-ntt-ala-rumahan-foto-resep-utama.jpg'],
        'kolo' => ['name' => "Kolo 'nasi Bakar Bambu", 'price' => 35, 'image' => 'images/nasi-bambu-kolo.jpeg'],
        'catemak' => ['name' => 'Catemak Jagung Manis', 'price' => 89, 'image' => 'images/catemak-jagung.jpg'],
        'kopi-bajawa' => ['name' => 'Kopi Bajawa Flores', 'price' => 35, 'image' => 'images/kopi-bajawa.jpg'],
    ];

    $validated = $request->validate([
        'product' => ['required', 'string', 'in:sei-sapi,kolo,catemak,kopi-bajawa'],
    ]);

    $product = $products[$validated['product']];
    $cart = session('cart', []);

    if (isset($cart[$validated['product']])) {
        $cart[$validated['product']]['quantity']++;
    } else {
        $cart[$validated['product']] = [...$product, 'quantity' => 1];
    }

    session(['cart' => $cart]);

    return back()->with('cart_status', $product['name'] . ' ditambahkan ke keranjang.');
})->name('keranjang.tambah');

Route::post('/keranjang/hapus', function (Request $request) {
    $validated = $request->validate([
        'product' => ['required', 'string'],
    ]);
    $cart = session('cart', []);
    unset($cart[$validated['product']]);
    session(['cart' => $cart]);

    return back();
})->name('keranjang.hapus');

Route::get('/checkout', function () {
    if (empty(session('cart', []))) {
        return redirect()->route('keranjang')->with('cart_status', 'Keranjang kamu masih kosong.');
    }

    $cart = session('cart');

    return view('customer.checkout', [
        'cart' => $cart,
        'total' => collect($cart)->sum(fn (array $item) => $item['price'] * $item['quantity']),
    ]);
})->middleware('auth')->name('checkout');

Route::post('/checkout/bayar', function (Request $request) {
    $request->validate(['payment_method' => ['required', 'in:transfer,e-wallet,cod']]);

    if (empty(session('cart', []))) {
        return redirect()->route('keranjang')->with('cart_status', 'Keranjang kamu masih kosong.');
    }

    session()->forget('cart');

    return redirect()->route('menu')->with('cart_status', 'Pesanan berhasil dibuat. Terima kasih!');
})->middleware('auth')->name('checkout.pay');

Route::get('/product', function () {
    return view('customer.product');
})->name('product');

Route::get('/about', function () {
    return view('customer.about');
})->name('about');

Route::get('/usersetting', function () {
    return view('customer.usersetting');
})->middleware('auth')->name('usersetting');

Route::post('/usersetting/avatar', function (Request $request) {
    $request->validate([
        'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ]);

    $user = $request->user();

    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    $user->update([
        'avatar' => $request->file('avatar')->store('avatars', 'public'),
    ]);

    return back()->with('status', 'Foto profil berhasil diperbarui.');
})->middleware('auth')->name('usersetting.avatar');

Route::middleware('guest')->group(function () {
    Route::view('/login', 'customer.login')->name('login');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withErrors(['email' => 'Email atau password yang kamu masukkan salah.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('menu'));
    })->name('login.store');

    Route::view('/register', 'customer.register')->name('register');

    Route::post('/register', function (Request $request) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create($validated);
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('menu'));
    })->name('register.store');
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login');
})->middleware('auth')->name('logout');

