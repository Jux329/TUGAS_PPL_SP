<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout | NTT Culinary's</title>
    @vite('resources/css/app.css')
</head>
<body class="min-h-screen bg-gray-50 text-gray-900">
    <x-navbar></x-navbar>
    <main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <a href="{{ route('keranjang') }}" class="text-sm font-medium text-orange-600 hover:text-orange-700">&larr; Kembali ke keranjang</a>
        <h1 class="mt-5 text-3xl font-bold tracking-tight">Checkout</h1>
        <p class="mt-2 text-sm text-gray-500">Halo, {{ Auth::user()->name }}. Pilih metode pembayaran untuk menyelesaikan pesanan.</p>

        <div class="mt-8 grid gap-6 md:grid-cols-[1fr_260px]">
            <form method="POST" action="{{ route('checkout.pay') }}" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                @csrf
                <h2 class="text-lg font-semibold">Metode pembayaran</h2>
                <div class="mt-4 space-y-3">
                    <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-orange-400">
                        <input type="radio" name="payment_method" value="transfer" required class="text-orange-600 focus:ring-orange-500">
                        <span class="text-sm font-medium">Transfer bank</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-orange-400">
                        <input type="radio" name="payment_method" value="e-wallet" class="text-orange-600 focus:ring-orange-500">
                        <span class="text-sm font-medium">E-wallet</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-orange-400">
                        <input type="radio" name="payment_method" value="cod" class="text-orange-600 focus:ring-orange-500">
                        <span class="text-sm font-medium">Bayar di tempat</span>
                    </label>
                </div>
                @error('payment_method')<p class="mt-3 text-sm text-red-600">{{ $message }}</p>@enderror
                <button type="submit" class="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Bayar sekarang</button>
            </form>

            <aside class="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 class="font-semibold">Pesanan kamu</h2>
                <div class="mt-4 space-y-3">
                    @foreach ($cart as $item)
                        <div class="flex justify-between gap-3 text-sm">
                            <span class="text-gray-600">{{ $item['name'] }} x{{ $item['quantity'] }}</span>
                            <span class="font-medium">Rp{{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}</span>
                        </div>
                    @endforeach
                </div>
                <div class="mt-4 flex justify-between border-t border-gray-100 pt-4 font-semibold">
                    <span>Total</span>
                    <span class="text-orange-600">Rp{{ number_format($total, 0, ',', '.') }}</span>
                </div>
            </aside>
        </div>
    </main>
</body>
</html>
