<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keranjang | NTT Culinary's</title>
    @vite('resources/css/app.css')
    <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
     
</head>
<body>
<!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-100">
  <body class="h-full">
  ```
-->
<div class="min-h-full">
<x-navbar>
</x-navbar>
<x-header>Keranjang</x-header>
  <main>
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Keranjang belanja</h1>
        <p class="mt-2 text-sm text-gray-500">Periksa kembali produk pilihanmu sebelum checkout.</p>
      </div>

      @if (session('cart_status'))
        <div class="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">{{ session('cart_status') }}</div>
      @endif

      @if (empty($cart))
        <div class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Keranjang masih kosong</h2>
          <p class="mt-2 text-sm text-gray-500">Tambahkan produk dari halaman menu untuk mulai berbelanja.</p>
          <a href="{{ route('product') }}" class="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Lihat menu</a>
        </div>
      @else
        <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div class="space-y-4">
            @foreach ($cart as $key => $item)
              <article class="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <img src="{{ asset($item['image']) }}" alt="{{ $item['name'] }}" class="size-24 shrink-0 rounded-xl object-cover">
                <div class="min-w-0 flex-1">
                  <h2 class="font-semibold text-gray-900">{{ $item['name'] }}</h2>
                  <p class="mt-1 text-sm text-gray-500">{{ $item['quantity'] }} x Rp{{ number_format($item['price'], 0, ',', '.') }}</p>
                  <p class="mt-2 font-semibold text-orange-600">Rp{{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}</p>
                </div>
                <form method="POST" action="{{ route('keranjang.hapus') }}" class="self-start">
                  @csrf
                  <input type="hidden" name="product" value="{{ $key }}">
                  <button type="submit" class="text-sm font-medium text-gray-400 transition hover:text-red-500">Hapus</button>
                </form>
              </article>
            @endforeach
          </div>

          <aside class="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900">Ringkasan pesanan</h2>
            <div class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <span class="text-sm text-gray-500">Total</span>
              <strong class="text-xl text-orange-600">Rp{{ number_format($total, 0, ',', '.') }}</strong>
            </div>
            <a href="{{ route('checkout') }}" class="mt-6 block rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600">Checkout</a>
            @guest
              <p class="mt-3 text-center text-xs leading-5 text-gray-500">Kamu akan diminta login atau registrasi sebelum pembayaran.</p>
            @endguest
          </aside>
        </div>
      @endif
    </div>
  </main>
</div>

</body>
</html>