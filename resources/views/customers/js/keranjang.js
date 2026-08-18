/* =========================================================
   KERANJANG CUSTOMER
   UMKM CULINARY'S NTT

   Tidak menggunakan script_global.js
   Tidak menggunakan CustomerApp
========================================================= */


/* =========================================================
   1. CEK LOGIN
========================================================= */

const currentCustomer =
    localStorage.getItem("ntt_current_customer");


if (!currentCustomer) {
    window.location.href = "login.html";
}


/* =========================================================
   2. FORMAT RUPIAH
========================================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(number) || 0);

}


/* =========================================================
   3. ESCAPE HTML
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
   4. AMBIL CUSTOMER
========================================================= */

function getCurrentCustomer() {

    const data =
        localStorage.getItem("ntt_current_customer");


    if (!data) {
        return null;
    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Data customer tidak valid."
        );

        return null;
    }

}


/* =========================================================
   5. AMBIL KERANJANG
========================================================= */

function getCart() {

    const data =
        localStorage.getItem("ntt_cart");


    if (!data) {
        return [];
    }


    try {

        const cart =
            JSON.parse(data);


        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Data keranjang tidak valid."
        );

        return [];
    }

}


/* =========================================================
   6. SIMPAN KERANJANG
========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        "ntt_cart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   7. HITUNG TOTAL
========================================================= */

function getCartTotal() {

    const cart =
        getCart();


    return cart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                );

        },
        0
    );

}


/* =========================================================
   8. UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    const totalQuantity =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    const countElement =
        document.getElementById(
            "cart-count"
        );


    if (countElement) {

        countElement.textContent =
            totalQuantity;

    }

}


/* =========================================================
   9. RENDER KERANJANG
========================================================= */

function renderCart() {

    const cart =
        getCart();


    const listContainer =
        document.getElementById(
            "cart-list-container"
        );


    const checkoutBox =
        document.getElementById(
            "checkout-box"
        );


    if (!listContainer) {
        return;
    }


    /* =========================
       KERANJANG KOSONG
    ========================== */

    if (cart.length === 0) {

        listContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Keranjang Belanja Kosong
                </h3>

                <p>
                    Anda belum menambahkan hidangan
                    ke keranjang.
                </p>

                <a
                    href="menu.html"
                    class="btn btn-primary"
                >
                    Lihat Menu Kuliner →
                </a>

            </div>

        `;


        if (checkoutBox) {
            checkoutBox.style.display =
                "none";
        }


        updateCartCount();

        updateSummary();

        return;
    }


    /* =========================
       TAMPILKAN CHECKOUT
    ========================== */

    if (checkoutBox) {
        checkoutBox.style.display =
            "block";
    }


    /* =========================
       HEADER
    ========================== */

    let html = `

        <div class="cart-header">

            <h2>
                Item Menu (${cart.length})
            </h2>

            <button
                type="button"
                class="clear-cart-btn"
                id="clear-cart-btn"
            >
                Kosongkan
            </button>

        </div>

        <div class="cart-items">

    `;


    /* =========================
       ITEM KERANJANG
    ========================== */

    cart.forEach(item => {

        const id =
            escapeHtml(item.id);

        const name =
            escapeHtml(item.name);

        const image =
            escapeHtml(item.image);

        const price =
            formatRupiah(item.price);

        const quantity =
            Number(item.quantity || 1);


        html += `

            <div class="cart-item">

                <img
                    src="${image}"
                    alt="${name}"
                    class="cart-item-image"
                >


                <div>

                    <h4 class="cart-item-name">
                        ${name}
                    </h4>

                    <div class="cart-item-price">
                        ${price}
                    </div>

                </div>


                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-btn"
                        onclick='updateQty(
                            ${JSON.stringify(item.id)},
                            ${quantity - 1}
                        )'
                    >
                        −
                    </button>


                    <span class="quantity-number">
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-btn"
                        onclick='updateQty(
                            ${JSON.stringify(item.id)},
                            ${quantity + 1}
                        )'
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-item-btn"
                    onclick='removeItem(
                        ${JSON.stringify(item.id)}
                    )'
                    title="Hapus item"
                >
                    🗑
                </button>

            </div>

        `;

    });


    html += `
        </div>
    `;


    listContainer.innerHTML =
        html;


    /* =========================
       EVENT KOSONGKAN
    ========================== */

    const clearButton =
        document.getElementById(
            "clear-cart-btn"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearAllCart
        );

    }


    updateSummary();

    updateCartCount();

}


/* =========================================================
   10. UPDATE JUMLAH ITEM
========================================================= */

function updateQty(id, newQty) {

    const cart =
        getCart();


    const item =
        cart.find(
            cartItem =>
                String(cartItem.id) === String(id)
        );


    if (!item) {

        showToast(
            "Item tidak ditemukan."
        );

        return;
    }


    newQty =
        Number(newQty);


    /* =========================
       JIKA JUMLAH 0
       HAPUS ITEM
    ========================== */

    if (newQty <= 0) {

        removeItem(id);

        return;
    }


    /* =========================
       CEK STOK
    ========================== */

    const stock =
        Number(item.stock || 0);


    if (
        stock > 0 &&
        newQty > stock
    ) {

        showToast(
            "Jumlah melebihi stok yang tersedia."
        );

        return;
    }


    item.quantity =
        newQty;


    saveCart(cart);

    renderCart();

}


/* =========================================================
   11. HAPUS ITEM
========================================================= */

function removeItem(id) {

    const cart =
        getCart();


    const item =
        cart.find(
            cartItem =>
                String(cartItem.id) === String(id)
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            `Hapus "${item.name}" dari keranjang?`
        );


    if (!confirmed) {
        return;
    }


    const newCart =
        cart.filter(
            cartItem =>
                String(cartItem.id) !== String(id)
        );


    saveCart(newCart);

    renderCart();


    showToast(
        "Item berhasil dihapus."
    );

}


/* =========================================================
   12. KOSONGKAN SEMUA KERANJANG
========================================================= */

function clearAllCart() {

    const cart =
        getCart();


    if (cart.length === 0) {
        return;
    }


    const confirmed =
        confirm(
            "Kosongkan semua pesanan di keranjang?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "ntt_cart"
    );


    renderCart();

    showToast(
        "Keranjang berhasil dikosongkan."
    );

}


/* =========================================================
   13. UPDATE TOTAL
========================================================= */

function updateSummary() {

    const subtotal =
        getCartTotal();


    const subtotalElement =
        document.getElementById(
            "summary-subtotal"
        );


    const totalElement =
        document.getElementById(
            "summary-total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatRupiah(subtotal);

    }


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(subtotal);

    }

}


/* =========================================================
   14. AUTO FILL CUSTOMER
========================================================= */

function autoFillUser() {

    const user =
        getCurrentCustomer();


    if (!user) {
        return;
    }


    const nameInput =
        document.getElementById(
            "order-cust-name"
        );


    const phoneInput =
        document.getElementById(
            "order-cust-phone"
        );


    const addressInput =
        document.getElementById(
            "order-cust-address"
        );


    if (
        nameInput &&
        user.name
    ) {

        nameInput.value =
            user.name;

    }


    if (
        phoneInput &&
        user.phone
    ) {

        phoneInput.value =
            user.phone;

    }


    if (
        addressInput &&
        user.address
    ) {

        addressInput.value =
            user.address;

    }

}


/* =========================================================
   15. VALIDASI NOMOR TELEPON
========================================================= */

function validatePhone(phone) {

    const cleaned =
        phone.replace(
            /[\s\-+]/g,
            ""
        );


    return /^[0-9]{10,15}$/.test(
        cleaned
    );

}


/* =========================================================
   16. BUAT NOMOR PESANAN
========================================================= */

function generateOrderId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `NTT-${year}${month}${day}-${random}`;

}


/* =========================================================
   17. SIMPAN PESANAN
========================================================= */

function createOrder(orderData) {

    const ordersData =
        localStorage.getItem(
            "ntt_orders"
        );


    let orders = [];


    if (ordersData) {

        try {

            const parsed =
                JSON.parse(ordersData);


            if (Array.isArray(parsed)) {
                orders = parsed;
            }

        } catch (error) {

            orders = [];

        }

    }


    const newOrder = {

        id: generateOrderId(),

        customerName:
            orderData.customerName,

        customerPhone:
            orderData.customerPhone,

        customerAddress:
            orderData.customerAddress,

        notes:
            orderData.notes,

        paymentMethod:
            orderData.paymentMethod,

        items:
            orderData.items,

        total:
            orderData.total,

        status:
            "Diproses",

        createdAt:
            new Date().toISOString()

    };


    orders.push(newOrder);


    localStorage.setItem(
        "ntt_orders",
        JSON.stringify(orders)
    );


    return newOrder;

}


/* =========================================================
   18. PROSES CHECKOUT
========================================================= */

function handlePlaceOrder(event) {

    event.preventDefault();


    const cart =
        getCart();


    if (cart.length === 0) {

        alert(
            "Keranjang Anda kosong!"
        );

        return;
    }


    const name =
        document.getElementById(
            "order-cust-name"
        ).value.trim();


    const phone =
        document.getElementById(
            "order-cust-phone"
        ).value.trim();


    const address =
        document.getElementById(
            "order-cust-address"
        ).value.trim();


    const notes =
        document.getElementById(
            "order-cust-notes"
        ).value.trim();


    const paymentMethod =
        document.getElementById(
            "order-payment-method"
        ).value;


    /* =========================
       VALIDASI
    ========================== */

    if (!name) {

        alert(
            "Nama penerima wajib diisi."
        );

        return;
    }


    if (!phone) {

        alert(
            "Nomor WhatsApp / telepon wajib diisi."
        );

        return;
    }


    if (!validatePhone(phone)) {

        alert(
            "Nomor WhatsApp / telepon tidak valid."
        );

        return;
    }


    if (!address) {

        alert(
            "Alamat pengiriman wajib diisi."
        );

        return;
    }


    if (!paymentMethod) {

        alert(
            "Silakan pilih metode pembayaran."
        );

        return;
    }


    const total =
        getCartTotal();


    /* =========================
       KONFIRMASI
    ========================== */

    const confirmed =
        confirm(
            `Konfirmasi pesanan?\n\n` +
            `Nama: ${name}\n` +
            `Total: ${formatRupiah(total)}\n` +
            `Pembayaran: ${paymentMethod}`
        );


    if (!confirmed) {
        return;
    }


    /* =========================
       BUAT PESANAN
    ========================== */

    const newOrder =
        createOrder({

            customerName:
                name,

            customerPhone:
                phone,

            customerAddress:
                address,

            notes:
                notes,

            paymentMethod:
                paymentMethod,

            items:
                cart.map(item => ({
                    ...item
                })),

            total:
                total

        });


    /* =========================
       KOSONGKAN KERANJANG
    ========================== */

    localStorage.removeItem(
        "ntt_cart"
    );


    /* =========================
       PESAN BERHASIL
    ========================== */

    alert(
        "Pesanan berhasil dibuat!\n\n" +
        "Nomor Pesanan: " +
        newOrder.id +
        "\n" +
        "Status: Diproses"
    );


    /* =========================
       KE HALAMAN PESANAN
    ========================== */

    window.location.href =
        "pesanan.html";

}


/* =========================================================
   19. LOGOUT
========================================================= */

function logoutCustomer() {

    const confirmed =
        confirm(
            "Apakah Anda yakin ingin keluar?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "ntt_current_customer"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   20. TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast-msg"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(
            function () {

                toast.style.display =
                    "none";

            },
            2500
        );

}


/* =========================================================
   21. INITIALIZATION
========================================================= */

function initializeCartPage() {

    const user =
        getCurrentCustomer();


    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    /* Render keranjang */

    renderCart();


    /* Isi data customer */

    autoFillUser();


    /* Update jumlah keranjang */

    updateCartCount();


    /* =========================
       CHECKOUT FORM
    ========================== */

    const checkoutForm =
        document.getElementById(
            "checkout-form"
        );


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            handlePlaceOrder
        );

    }


    /* =========================
       LOGOUT
    ========================== */

    const logoutButton =
        document.getElementById(
            "logout-btn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutCustomer
        );

    }

}


/* =========================================================
   22. JALANKAN SCRIPT
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCartPage
    );

} else {

    initializeCartPage();

}