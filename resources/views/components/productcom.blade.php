<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" x-data>
  <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">

    <article
      x-cloak
      x-show="$store.shop.activeCategory === 'semua' || $store.shop.activeCategory === 'makanan'"
      x-transition
      class="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-300"
    >
      <div class="aspect-square w-full overflow-hidden bg-gray-200">
        <img src="{{ asset('images/sei-sapi-sambal-luat-ntt-ala-rumahan-foto-resep-utama.jpg') }}" alt="Se'i Sapi Sambal Lu'at" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-600">Se'i Sapi Sambal Lu'at</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">Rp 48.000</p>
          <form method="POST" action="{{ route('keranjang.tambah') }}" class="mt-3">
            @csrf
            <input type="hidden" name="product" value="sei-sapi">
            <button type="submit" class="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Tambah ke keranjang</button>
          </form>
      </div>
    </article>

    <article
      x-cloak
      x-show="$store.shop.activeCategory === 'semua' || $store.shop.activeCategory === 'makanan'"
      x-transition
      class="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-300"
    >
      <div class="aspect-square w-full overflow-hidden bg-gray-200">
        <img src="{{ asset('images/nasi-bambu-kolo.jpeg') }}" alt="Kolo Nasi Bakar Bambu" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-600">Kolo 'nasi Bakar Bambu'</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">Rp 35.000</p>
          <form method="POST" action="{{ route('keranjang.tambah') }}" class="mt-3">
            @csrf
            <input type="hidden" name="product" value="kolo">
            <button type="submit" class="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Tambah ke keranjang</button>
          </form>
      </div>
    </article>

    <article
      x-cloak
      x-show="$store.shop.activeCategory === 'semua' || $store.shop.activeCategory === 'makanan'"
      x-transition
      class="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-300"
    >
      <div class="aspect-square w-full overflow-hidden bg-gray-200">
        <img src="{{ asset('images/catemak-jagung.jpg') }}" alt="Catemak Jagung Manis" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-600">Catemak Jagung Manis</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">Rp 89.000</p>
          <form method="POST" action="{{ route('keranjang.tambah') }}" class="mt-3">
            @csrf
            <input type="hidden" name="product" value="catemak">
            <button type="submit" class="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Tambah ke keranjang</button>
          </form>
      </div>
    </article>

    <article
      x-cloak
      x-show="$store.shop.activeCategory === 'semua' || $store.shop.activeCategory === 'minuman'"
      x-transition
      class="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-300"
    >
      <div class="aspect-square w-full overflow-hidden bg-gray-200">
        <img src="{{ asset('images/kopi-bajawa.jpg') }}" alt="Kopi Bajawa Flores" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-600">Kopi Bajawa Flores</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">Rp 35.000</p>
          <form method="POST" action="{{ route('keranjang.tambah') }}" class="mt-3">
            @csrf
            <input type="hidden" name="product" value="kopi-bajawa">
            <button type="submit" class="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Tambah ke keranjang</button>
          </form>
      </div>
    </article>

  </div>
</div>