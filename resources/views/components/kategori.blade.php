<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" x-data>
  <div class="flex flex-wrap items-center justify-center gap-3 border-b border-gray-200 pb-6" role="tablist" aria-label="Filter kategori produk">

    <button
      type="button"
      role="tab"
      :aria-selected="$store.shop.activeCategory === 'semua'"
      @click="$store.shop.activeCategory = 'semua'"
      :class="$store.shop.activeCategory === 'semua'
        ? 'bg-orange-500 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
    >
      Semua
    </button>

    <button
      type="button"
      role="tab"
      :aria-selected="$store.shop.activeCategory === 'makanan'"
      @click="$store.shop.activeCategory = 'makanan'"
      :class="$store.shop.activeCategory === 'makanan'
        ? 'bg-orange-500 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
    >
      Makanan
    </button>

    <button
      type="button"
      role="tab"
      :aria-selected="$store.shop.activeCategory === 'minuman'"
      @click="$store.shop.activeCategory = 'minuman'"
      :class="$store.shop.activeCategory === 'minuman'
        ? 'bg-orange-500 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
    >
      Minuman
    </button>

  </div>
</div>
