/* =========================================================
   PESANAN CUSTOMER
   File: customers/js/pesanan.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. CEK LOGIN
       ===================================================== */

    const currentCustomer =
        localStorage.getItem("ntt_current_customer");

    if (!currentCustomer) {
        window.location.href = "login.html";
        return;
    }


    /* =====================================================
       2. PARSE DATA CUSTOMER
       ===================================================== */

    let customer = null;

    try {
        customer = JSON.parse(currentCustomer);
    } catch (error) {
        console.error("Data customer tidak valid:", error);

        localStorage.removeItem("ntt_current_customer");
        window.location.href = "login.html";
        return;
    }


    /* =====================================================
       3. NAVBAR
       ===================================================== */

    const logoutButton =
        document.getElementById("logout-btn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Apakah Anda yakin ingin keluar dari akun?"
            );

            if (!confirmLogout) {
                return;
            }

            localStorage.removeItem("ntt_current_customer");

            window.location.href = "login.html";
        });
    }


    /* =====================================================
       4. TAMPILKAN INFO CUSTOMER
       ===================================================== */

    renderCustomerInfo(customer);


    /* =====================================================
       5. UPDATE JUMLAH KERANJANG
       ===================================================== */

    updateCartCount();


    /* =====================================================
       6. TAMPILKAN PESANAN
       ===================================================== */

    renderOrders();
});


/* =========================================================
   RENDER INFO CUSTOMER
   ========================================================= */

function renderCustomerInfo(customer) {

    const container =
        document.getElementById("customer-info");

    if (!container) {
        return;
    }

    const username =
        (customer && customer.username) || "Pelanggan";

    container.innerHTML = `

        <div class="customer-info-title">
            Masuk Sebagai
        </div>

        <div class="customer-info-name">
            ${username}
        </div>

        <div class="customer-info-username">
            @${username}
        </div>

    `;

}


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(number) || 0);

}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    let cart = [];

    try {

        const storedCart =
            localStorage.getItem("ntt_cart");

        if (storedCart) {
            cart = JSON.parse(storedCart);
        }

    } catch (error) {

        console.error(
            "Gagal membaca keranjang:",
            error
        );

        cart = [];

    }


    const totalQuantity = cart.reduce(
        function (total, item) {

            return total +
                (Number(item.quantity) || 0);

        },
        0
    );


    cartCount.textContent = totalQuantity;

}


/* =========================================================
   AMBIL DATA PESANAN
   ========================================================= */

function getCustomerOrders() {

    let orders = [];

    /*
       Beberapa kemungkinan key lama dicek agar
       data pesanan yang sudah tersimpan tidak langsung hilang.
    */

    const possibleKeys = [
        "ntt_orders",
        "ntt_customer_orders",
        "customer_orders",
        "orders"
    ];


    for (const key of possibleKeys) {

        const storedOrders =
            localStorage.getItem(key);

        if (!storedOrders) {
            continue;
        }


        try {

            const parsedOrders =
                JSON.parse(storedOrders);

            if (Array.isArray(parsedOrders)) {
                orders = parsedOrders;
                break;
            }

        } catch (error) {

            console.error(
                "Data pesanan pada key " +
                key +
                " tidak valid:",
                error
            );

        }

    }


    return orders;

}


/* =========================================================
   TAMPILKAN PESANAN
   ========================================================= */

function renderOrders() {

    const container =
        document.getElementById(
            "customer-orders-container"
        );


    if (!container) {
        console.error(
            "Element customer-orders-container tidak ditemukan."
        );

        return;
    }


    const orders =
        getCustomerOrders();


    /* =====================================================
       JIKA TIDAK ADA PESANAN
       ===================================================== */

    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-orders">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    Belum Ada Pesanan
                </h3>

                <p>
                    Anda belum melakukan pemesanan makanan atau minuman.
                </p>

                <a
                    href="menu.html"
                    class="btn btn-primary"
                >
                    Pesan Sekarang →
                </a>

            </div>

        `;

        return;
    }


    /* =====================================================
       TAMPILKAN PESANAN
       ===================================================== */

    container.innerHTML = orders
        .map(function (order) {

            return createOrderCard(order);

        })
        .join("");

}


/* =========================================================
   BUAT CARD PESANAN
   ========================================================= */

function createOrderCard(order) {

    const orderStatus =
        order.orderStatus ||
        order.status ||
        "Menunggu";


    const paymentStatus =
        order.paymentStatus ||
        "Belum Dibayar";


    const paymentMethod =
        order.paymentMethod ||
        "-";


    const orderId =
        order.id ||
        order.orderId ||
        "-";


    const createdAt =
        order.createdAt ||
        order.date ||
        "-";


    const customerName =
        order.customerName ||
        "-";


    const customerAddress =
        order.customerAddress ||
        "-";


    const notes =
        order.notes ||
        "";


    const total =
        Number(order.total) || 0;


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    /* =====================================================
       STATUS CLASS
       ===================================================== */

    let statusClass =
        "status-menunggu";


    if (orderStatus === "Diproses") {
        statusClass =
            "status-diproses";
    }

    else if (orderStatus === "Siap Diambil") {
        statusClass =
            "status-siap";
    }

    else if (orderStatus === "Selesai") {
        statusClass =
            "status-selesai";
    }

    else if (orderStatus === "Dibatalkan") {
        statusClass =
            "status-dibatalkan";
    }


    /* =====================================================
       ITEMS
       ===================================================== */

    const itemsHTML =
        items.length > 0

            ? items.map(function (item) {

                const itemName =
                    item.name || "Produk";

                const itemImage =
                    item.image || "";

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(item.price) || 0;

                const itemTotal =
                    price * quantity;


                return `

                    <div class="order-item">

                        <div class="order-item-left">

                            ${
                                itemImage
                                    ? `
                                    <img
                                        src="${itemImage}"
                                        alt="${itemName}"
                                        class="order-item-image"
                                    >
                                    `
                                    : `
                                    <div class="order-item-image-placeholder">
                                        🍽️
                                    </div>
                                    `
                            }


                            <div>

                                <div class="order-item-name">
                                    ${itemName}
                                </div>

                                <div class="order-item-quantity">
                                    × ${quantity}
                                </div>

                            </div>

                        </div>


                        <div class="order-item-price">
                            ${formatRupiah(itemTotal)}
                        </div>

                    </div>

                `;

            }).join("")

            : `
                <div class="no-items">
                    Tidak ada detail item.
                </div>
            `;


    /* =====================================================
       CARD
       ===================================================== */

    return `

        <article class="order-card">


            <!-- HEADER -->

            <div class="order-header">


                <div>

                    <span class="order-label">
                        Nomor Pesanan
                    </span>

                    <div class="order-id">
                        ${orderId}
                    </div>

                    <div class="order-date">
                        ${createdAt}
                    </div>

                </div>


                <div class="order-status-area">

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ● ${orderStatus}
                    </span>


                    <div class="payment-status">

                        Bayar:
                        ${paymentStatus}

                        ${
                            paymentMethod !== "-"
                                ? `(${paymentMethod})`
                                : ""
                        }

                    </div>

                </div>


            </div>


            <!-- ITEMS -->

            <div class="order-items">

                ${itemsHTML}

            </div>


            <!-- FOOTER -->

            <div class="order-footer">


                <div class="order-destination">

                    <strong>
                        Tujuan:
                    </strong>

                    ${customerAddress}

                    (${customerName})


                    ${
                        notes
                            ? `
                            <br>

                            <em>
                                Catatan:
                                "${notes}"
                            </em>
                            `
                            : ""
                    }

                </div>


                <div class="order-total">

                    <span>
                        Total Pesanan:
                    </span>

                    <strong>
                        ${formatRupiah(total)}
                    </strong>

                </div>


            </div>


        </article>

    `;

}