<div class="relative w-full max-w-md" x-data>
  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </svg>
  </div>
  <input
    x-model="$store.shop.searchQuery"
    type="search"
    name="search"
    autocomplete="off"
    placeholder="Cari produk..."
    aria-label="Cari produk"
    class="block w-full rounded-4xl border border-gray-200 bg-white py-1.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
  >
  <button
    x-show="$store.shop.searchQuery"
    x-cloak
    type="button"
    @click="$store.shop.searchQuery = ''"
    class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 transition hover:text-orange-500"
    aria-label="Hapus pencarian"
  >
    <span aria-hidden="true" class="text-xl leading-none">&times;</span>
  </button>
</div>