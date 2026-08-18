/* =========================================================
   MENU CUSTOMER - UMKM CULINARY'S NTT
   File: js/menu.js

   Penyimpanan LocalStorage:
   - ntt_current_customer : customer yang sedang login
   - ntt_products         : data produk
   - ntt_categories       : data kategori
   - ntt_cart             : isi keranjang
========================================================= */


/* =========================================================
   1. CEK LOGIN
========================================================= */

const currentCustomer = localStorage.getItem("ntt_current_customer");

if (!currentCustomer) {
    window.location.href = "login.html";
}


/* =========================================================
   2. DATA PRODUK DEFAULT
   Digunakan apabila ntt_products belum tersedia.
========================================================= */

const defaultProducts = [
    {
        id: "prod-1",
        name: "Se’i Sapi Sambal Lu’at",
        category: "Makanan",
        price: 45000,
        description:
            "Daging sapi asap khas Kupang NTT dengan aroma kayu kosambi harum dan sambal lu’at fermentasi jeruk nipis.",
        image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        stock: 25,
        status: "Aktif"
    },

    {
        id: "prod-2",
        name: "Kolo (Nasi Bakar Bambu)",
        category: "Makanan",
        price: 30000,
        description:
            "Nasi bakar bambu khas Manggarai dengan rempah pilihan, disajikan hangat dengan lauk pendamping gurih.",
        image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
        stock: 20,
        status: "Aktif"
    },

    {
        id: "prod-3",
        name: "Catemak Jagung Manis",
        category: "Snack",
        price: 18000,
        description:
            "Hidangan penutup manis khas NTT berbahan jagung pulut, kacang tanah, kacang hijau, dan labu lilin.",
        image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        stock: 35,
        status: "Aktif"
    },

    {
        id: "prod-4",
        name: "Kopi Bajawa Flores (Arabika)",
        category: "Minuman",
        price: 22000,
        description:
            "Seduhan kopi Arabika asli Bajawa Flores dengan profil rasa cokelat, kacang karamel, dan body yang tebal.",
        image:
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        stock: 50,
        status: "Aktif"
    },

    {
        id: "prod-5",
        name: "Paket Komodo Spesial (Se’i + Kolo + Kopi)",
        category: "Paket",
        price: 85000,
        description:
            "Paket komplit: 1 Porsi Se’i Sapi, 1 Nasi Kolo Bambu, Sambal Lu’at, dan 1 Cup Kopi Bajawa Flores Dingin/Panas.",
        image:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        stock: 15,
        status: "Aktif"
    }
];


/* =========================================================
   3. DATA KATEGORI DEFAULT
========================================================= */

const defaultCategories = [
    {
        id: "cat-1",
        name: "Makanan"
    },

    {
        id: "cat-2",
        name: "Minuman"
    },

    {
        id: "cat-3",
        name: "Snack"
    },

    {
        id: "cat-4",
        name: "Paket"
    }
];


/* =========================================================
   4. VARIABEL HALAMAN
========================================================= */

let allProducts = [];

let currentCategory = "Semua";

let searchQuery = "";

let selectedModalProduct = null;

let modalQuantity = 1;

let toastTimer = null;


/* =========================================================
   5. FUNGSI LOCAL STORAGE
========================================================= */

function getStore(key, defaultValue) {
    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Gagal membaca LocalStorage:", key, error);
        return defaultValue;
    }
}


/* =========================================================
   6. FORMAT RUPIAH
========================================================= */

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(number) || 0);
}


/* =========================================================
   7. ESCAPE HTML
   Untuk mencegah karakter khusus merusak HTML.
========================================================= */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   8. AMBIL KERANJANG
========================================================= */

function getCart() {
    const data = localStorage.getItem("ntt_cart");

    if (!data) {
        return [];
    }

    try {
        const cart = JSON.parse(data);

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Data keranjang rusak.");
        return [];
    }
}


/* =========================================================
   9. SIMPAN KERANJANG
========================================================= */

function saveCart(cart) {
    localStorage.setItem(
        "ntt_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =========================================================
   10. UPDATE JUMLAH KERANJANG DI NAVBAR
========================================================= */

function updateCartCount() {
    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => {
            return total + Number(item.quantity || 0);
        },
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}


/* =========================================================
   11. TAMBAH PRODUK KE KERANJANG
========================================================= */

function addToCart(product, quantity = 1) {

    if (!product) {
        showToast("Produk tidak ditemukan.");
        return;
    }

    quantity = Number(quantity);

    if (quantity < 1) {
        quantity = 1;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
        showToast("Menu sedang tidak tersedia.");
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        item => item.id === product.id
    );

    if (existingItem) {

        const currentQuantity =
            Number(existingItem.quantity || 0);

        const newQuantity =
            currentQuantity + quantity;

        if (newQuantity > stock) {
            showToast(
                "Jumlah melebihi stok yang tersedia."
            );
            return;
        }

        existingItem.quantity = newQuantity;

    } else {

        if (quantity > stock) {
            showToast(
                "Jumlah melebihi stok yang tersedia."
            );
            return;
        }

        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            image: product.image,
            quantity: quantity,
            stock: stock
        });
    }

    saveCart(cart);

    showToast(
        product.name +
        " berhasil ditambahkan ke keranjang."
    );
}


/* =========================================================
   12. TAMBAH PRODUK DARI CARD
========================================================= */

function addToCartDirect(productId) {

    const product = allProducts.find(
        item => item.id === productId
    );

    if (!product) {
        showToast("Produk tidak ditemukan.");
        return;
    }

    addToCart(product, 1);
}


/* =========================================================
   13. RENDER KATEGORI
========================================================= */

function renderCategories() {

    const container =
        document.getElementById("category-chips");

    if (!container) {
        return;
    }

    const categories = getStore(
        "ntt_categories",
        defaultCategories
    );

    let html = "";

    /* Tombol Semua */

    html += `
        <button
            type="button"
            class="category-chip ${
                currentCategory === "Semua"
                    ? "active"
                    : ""
            }"
            onclick="selectCategory('Semua')"
        >
            Semua
        </button>
    `;


    /* Kategori lainnya */

    categories.forEach(category => {

        if (!category || !category.name) {
            return;
        }

        const categoryName =
            String(category.name);

        html += `
            <button
                type="button"
                class="category-chip ${
                    currentCategory === categoryName
                        ? "active"
                        : ""
                }"
                onclick='selectCategory(${JSON.stringify(categoryName)})'
            >
                ${escapeHtml(categoryName)}
            </button>
        `;
    });

    container.innerHTML = html;
}


/* =========================================================
   14. PILIH KATEGORI
========================================================= */

function selectCategory(category) {

    currentCategory = category;

    renderCategories();

    renderMenu();
}


/* =========================================================
   15. SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById("search-input");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            searchQuery =
                this.value
                    .trim()
                    .toLowerCase();

            renderMenu();
        }
    );
}


/* =========================================================
   16. FILTER PRODUK
========================================================= */

function getFilteredProducts() {

    return allProducts.filter(product => {

        /*
         * Produk nonaktif tidak ditampilkan
         */

        if (
            String(product.status).toLowerCase()
            === "nonaktif"
        ) {
            return false;
        }


        /*
         * Filter kategori
         */

        const matchesCategory =
            currentCategory === "Semua" ||
            product.category === currentCategory;


        /*
         * Filter pencarian
         */

        const productName =
            String(product.name || "")
                .toLowerCase();

        const productDescription =
            String(product.description || "")
                .toLowerCase();

        const matchesSearch =
            productName.includes(searchQuery) ||
            productDescription.includes(searchQuery);


        return (
            matchesCategory &&
            matchesSearch
        );
    });
}


/* =========================================================
   17. RENDER MENU
========================================================= */

function renderMenu() {

    const container =
        document.getElementById("menu-container");

    if (!container) {
        return;
    }

    const filteredProducts =
        getFilteredProducts();


    /*
     * Jika tidak ada produk
     */

    if (filteredProducts.length === 0) {

        container.innerHTML = `
            <div class="empty-menu">

                <div class="empty-icon">
                    🍽️
                </div>

                <h3 class="empty-title">
                    Menu tidak ditemukan
                </h3>

                <p class="empty-desc">
                    Coba ganti kata kunci pencarian
                    atau pilih kategori lainnya.
                </p>

            </div>
        `;

        return;
    }


    /*
     * Tampilkan produk
     */

    container.innerHTML =
        filteredProducts
            .map(product => {

                const productId =
                    escapeHtml(product.id);

                const productName =
                    escapeHtml(product.name);

                const productCategory =
                    escapeHtml(product.category);

                const productDescription =
                    escapeHtml(
                        product.description ||
                        "Hidangan lezat khas NTT."
                    );

                const productImage =
                    escapeHtml(product.image);


                return `
                    <div class="product-card">

                        <div
                            class="product-img-wrap"
                            onclick='openDetailModal(${JSON.stringify(product.id)})'
                        >

                            <img
                                src="${productImage}"
                                alt="${productName}"
                                class="product-img"
                                loading="lazy"
                            >

                            <span class="product-cat-tag">
                                ${productCategory}
                            </span>

                        </div>


                        <div class="product-body">

                            <h3
                                class="product-title"
                                onclick='openDetailModal(${JSON.stringify(product.id)})'
                            >
                                ${productName}
                            </h3>


                            <p class="product-desc">
                                ${productDescription}
                            </p>


                            <div class="product-footer">

                                <span class="product-price">
                                    ${formatRupiah(product.price)}
                                </span>


                                <button
                                    type="button"
                                    class="btn-add-cart"
                                    onclick='addToCartDirect(${JSON.stringify(product.id)})'
                                >
                                    + Keranjang
                                </button>

                            </div>

                        </div>

                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   18. BUKA DETAIL PRODUK
========================================================= */

function openDetailModal(productId) {

    const product =
        allProducts.find(
            item => item.id === productId
        );

    if (!product) {
        showToast("Produk tidak ditemukan.");
        return;
    }

    selectedModalProduct = product;

    modalQuantity = 1;


    const modal =
        document.getElementById("detail-modal");

    const image =
        document.getElementById("detail-img");

    const category =
        document.getElementById("detail-cat");

    const name =
        document.getElementById("detail-name");

    const description =
        document.getElementById("detail-desc");

    const price =
        document.getElementById("detail-price");

    const quantity =
        document.getElementById("modal-qty");


    if (!modal) {
        return;
    }


    if (image) {
        image.src = product.image || "";
        image.alt = product.name || "Produk";
    }

    if (category) {
        category.textContent =
            product.category || "";
    }

    if (name) {
        name.textContent =
            product.name || "";
    }

    if (description) {
        description.textContent =
            product.description || "";
    }

    if (price) {
        price.textContent =
            formatRupiah(product.price);
    }

    if (quantity) {
        quantity.textContent =
            modalQuantity;
    }


    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
}


/* =========================================================
   19. TUTUP DETAIL PRODUK
========================================================= */

function closeDetailModal() {

    const modal =
        document.getElementById("detail-modal");

    if (modal) {
        modal.style.display = "none";
    }

    document.body.style.overflow = "";

    selectedModalProduct = null;

    modalQuantity = 1;
}


/* =========================================================
   20. UBAH JUMLAH DI DETAIL PRODUK
========================================================= */

function changeModalQty(delta) {

    if (!selectedModalProduct) {
        return;
    }

    const stock =
        Number(selectedModalProduct.stock || 0);

    let newQuantity =
        modalQuantity + Number(delta);


    if (newQuantity < 1) {
        newQuantity = 1;
    }


    if (newQuantity > stock) {

        showToast(
            "Jumlah melebihi stok yang tersedia."
        );

        return;
    }


    modalQuantity = newQuantity;


    const quantity =
        document.getElementById("modal-qty");

    if (quantity) {
        quantity.textContent =
            modalQuantity;
    }
}


/* =========================================================
   21. TOMBOL TAMBAH KERANJANG PADA MODAL
========================================================= */

function initializeModalCartButton() {

    const button =
        document.getElementById(
            "modal-add-cart-btn"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            if (!selectedModalProduct) {
                showToast("Produk tidak ditemukan.");
                return;
            }

            addToCart(
                selectedModalProduct,
                modalQuantity
            );

            closeDetailModal();
        }
    );
}


/* =========================================================
   22. KLIK DI LUAR MODAL
========================================================= */

function initializeModal() {

    const modal =
        document.getElementById("detail-modal");

    if (!modal) {
        return;
    }

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {
                closeDetailModal();
            }
        }
    );
}


/* =========================================================
   23. TOMBOL ESC UNTUK MENUTUP MODAL
========================================================= */

function initializeKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeDetailModal();
            }
        }
    );
}


/* =========================================================
   24. TOAST MESSAGE
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast-msg");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.style.display = "block";


    if (toastTimer) {
        clearTimeout(toastTimer);
    }


    toastTimer = setTimeout(
        function () {

            toast.style.display = "none";

        },
        2500
    );
}


/* =========================================================
   25. LOGOUT CUSTOMER
========================================================= */

function logoutCustomer() {

    const confirmLogout =
        confirm(
            "Apakah Anda yakin ingin keluar?"
        );

    if (!confirmLogout) {
        return;
    }


    /*
     * Hapus sesi customer.
     * Akun yang sudah register tetap tersimpan.
     */

    localStorage.removeItem(
        "ntt_current_customer"
    );


    /*
     * Setelah logout kembali ke login.
     */

    window.location.href =
        "login.html";
}


/* =========================================================
   26. LOAD DATA PRODUK
========================================================= */

function loadProducts() {

    const storedProducts =
        localStorage.getItem("ntt_products");


    if (!storedProducts) {

        allProducts =
            [...defaultProducts];

        return;
    }


    try {

        const products =
            JSON.parse(storedProducts);


        if (Array.isArray(products)) {

            allProducts = products;

        } else {

            allProducts =
                [...defaultProducts];
        }

    } catch (error) {

        console.error(
            "Data produk tidak dapat dibaca:",
            error
        );

        allProducts =
            [...defaultProducts];
    }
}


/* =========================================================
   27. INITIALIZATION
========================================================= */

function initializeMenu() {

    /*
     * Pastikan customer masih login.
     */

    const customer =
        localStorage.getItem(
            "ntt_current_customer"
        );


    if (!customer) {

        window.location.href =
            "login.html";

        return;
    }


    /*
     * Ambil data produk.
     */

    loadProducts();


    /*
     * Tampilkan kategori.
     */

    renderCategories();


    /*
     * Tampilkan produk.
     */

    renderMenu();


    /*
     * Aktifkan pencarian.
     */

    initializeSearch();


    /*
     * Aktifkan modal.
     */

    initializeModal();


    initializeModalCartButton();


    /*
     * Aktifkan tombol keyboard.
     */

    initializeKeyboard();


    /*
     * Update jumlah keranjang.
     */

    updateCartCount();
}


/* =========================================================
   28. JALANKAN SAAT HTML SUDAH SELESAI DIMUAT
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMenu
    );

} else {

    initializeMenu();

}