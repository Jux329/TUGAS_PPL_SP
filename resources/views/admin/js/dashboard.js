/**
 * dashboard.js - Admin UMKM Culinary's NTT
 * Berisi helper data global (AdminDB, render sidebar) + logika khusus halaman dashboard.html.
 */

const STORAGE_KEYS = {
  ADMIN_AUTH: 'umkm_admin_auth',
  USER_AUTH: 'umkm_customer_auth',
  PRODUCTS: 'umkm_products_db',
  CATEGORIES: 'umkm_categories_db',
  ORDERS: 'umkm_orders_db',
  CART: 'umkm_customer_cart',
  USERS_DB: 'umkm_users_db'
};

// Initial default seed data
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Makanan' },
  { id: 'cat-2', name: 'Minuman' },
  { id: 'cat-3', name: 'Snack' },
  { id: 'cat-4', name: 'Paket' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Se’i Sapi Sambal Lu’at',
    category: 'Makanan',
    price: 45000,
    description: 'Daging sapi asap khas Kupang NTT dengan aroma kayu kosambi harum dan sambal lu’at fermentasi jeruk nipis.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    status: 'Aktif'
  },
  {
    id: 'prod-2',
    name: 'Kolo (Nasi Bakar Bambu)',
    category: 'Makanan',
    price: 30000,
    description: 'Nasi bakar bambu khas Manggarai dengan rempah pilihan, disajikan hangat dengan lauk pendamping gurih.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    status: 'Aktif'
  },
  {
    id: 'prod-3',
    name: 'Catemak Jagung Manis',
    category: 'Snack',
    price: 18000,
    description: 'Hidangan penutup manis khas NTT berbahan jagung pulut, kacang tanah, kacang hijau, dan labu lilin.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    stock: 35,
    status: 'Aktif'
  },
  {
    id: 'prod-4',
    name: 'Kopi Bajawa Flores (Arabika)',
    category: 'Minuman',
    price: 22000,
    description: 'Seduhan kopi Arabika asli Bajawa Flores dengan profil rasa cokelat, kacang karamel, dan body yang tebal.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    status: 'Aktif'
  },
  {
    id: 'prod-5',
    name: 'Paket Komodo Spesial (Se’i + Kolo + Kopi)',
    category: 'Paket',
    price: 85000,
    description: 'Paket komplit: 1 Porsi Se’i Sapi, 1 Nasi Kolo Bambu, Sambal Lu’at, dan 1 Cup Kopi Bajawa Flores Dingin/Panas.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    status: 'Aktif'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-2026-001',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    customerAddress: 'Jl. El Tari No. 45, Oebobo, Kota Kupang, NTT',
    items: [
      { id: 'prod-1', name: 'Se’i Sapi Sambal Lu’at', price: 45000, quantity: 2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
      { id: 'prod-4', name: 'Kopi Bajawa Flores (Arabika)', price: 22000, quantity: 2, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' }
    ],
    total: 134000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Berhasil',
    orderStatus: 'Diproses',
    createdAt: '14 Agustus 2026',
    notes: 'Sambal lu’at dipisah ya mas'
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Maria Yohana',
    customerPhone: '082198765432',
    customerAddress: 'Komp. Walikota Kupang Blok B2 No. 12',
    items: [
      { id: 'prod-5', name: 'Paket Komodo Spesial', price: 85000, quantity: 1, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' }
    ],
    total: 85000,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Berhasil',
    orderStatus: 'Siap Diambil',
    createdAt: '14 Agustus 2026',
    notes: ''
  },
  {
    id: 'ORD-2026-003',
    customerName: 'Antonius Doko',
    customerPhone: '081377889900',
    customerAddress: 'Jl. Frans Seda No. 88, Kupang',
    items: [
      { id: 'prod-3', name: 'Catemak Jagung Manis', price: 18000, quantity: 3, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }
    ],
    total: 54000,
    paymentMethod: 'GoPay',
    paymentStatus: 'Menunggu',
    orderStatus: 'Menunggu',
    createdAt: '14 Agustus 2026',
    notes: 'Jangan terlalu manis'
  }
];

// Helper to get or set initial
function getStorage(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

// Global App DB instance
const AdminDB = {
  getProducts() {
    let p = getStorage(STORAGE_KEYS.PRODUCTS, null);
    if (!p) {
      setStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      p = DEFAULT_PRODUCTS;
    }
    return p;
  },
  saveProducts(list) {
    setStorage(STORAGE_KEYS.PRODUCTS, list);
  },
  getCategories() {
    let c = getStorage(STORAGE_KEYS.CATEGORIES, null);
    if (!c) {
      setStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      c = DEFAULT_CATEGORIES;
    }
    return c;
  },
  saveCategories(list) {
    setStorage(STORAGE_KEYS.CATEGORIES, list);
  },
  getOrders() {
    let o = getStorage(STORAGE_KEYS.ORDERS, null);
    if (!o) {
      setStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      o = DEFAULT_ORDERS;
    }
    return o;
  },
  saveOrders(list) {
    setStorage(STORAGE_KEYS.ORDERS, list);
  },
  formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  },
  checkAuth() {
    const auth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return auth === 'true';
  },
  login(email, pass) {
    if (email === 'admin@warung.com' && pass === 'password123') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

// Render Sidebar Navigation
function renderAdminSidebar(activePage) {
  const sidebar = document.getElementById('admin-sidebar-container');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="admin-sidebar">
      <div class="brand-box">
        <div class="brand-icon">🍽️</div>
        <div>
          <div class="brand-title">UMKM Culinary’s</div>
          <div class="brand-subtitle">NTT Admin</div>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <a href="kelola_pesanan.html" class="nav-link ${activePage === 'pesanan' ? 'active' : ''}">
          <span class="nav-icon">🛍️</span> Kelola Pesanan
        </a>
        <a href="kelola_produk.html" class="nav-link ${activePage === 'produk' ? 'active' : ''}">
          <span class="nav-icon">🍗</span> Kelola Produk
        </a>
        <a href="kelola_kategori.html" class="nav-link ${activePage === 'kategori' ? 'active' : ''}">
          <span class="nav-icon">📁</span> Kelola Kategori
        </a>
      </nav>

      <div class="admin-footer-nav">
        <a href="../customers/menu.html" class="nav-link" target="_blank" style="color: #fb923c;">
          <span class="nav-icon">🏪</span> Lihat Toko Customer
        </a>
        <a href="logout.html" class="nav-link" style="color: #f87171;">
          <span class="nav-icon">🚪</span> Logout
        </a>
      </div>
    </div>
  `;
}

/* ===== Logika khusus halaman dashboard.html (dipindahkan dari <script> inline) ===== */
renderAdminSidebar('dashboard');

    const orders = AdminDB.getOrders();
    const products = AdminDB.getProducts();

    // Stats
    document.getElementById('stat-total-orders').innerText = orders.length;
    document.getElementById('stat-selesai').innerText = orders.filter(o => o.orderStatus === 'Selesai').length;
    document.getElementById('stat-menunggu').innerText = orders.filter(o => o.orderStatus === 'Menunggu').length;
    document.getElementById('stat-total-products').innerText = products.length;

    const diproses = orders.filter(o => o.orderStatus === 'Diproses').length;
    const siap = orders.filter(o => o.orderStatus === 'Siap Diambil').length;
    const selesai = orders.filter(o => o.orderStatus === 'Selesai').length;
    const menunggu = orders.filter(o => o.orderStatus === 'Menunggu').length;

    document.getElementById('badge-count-menunggu').innerText = menunggu;
    document.getElementById('badge-count-diproses').innerText = diproses;
    document.getElementById('badge-count-siap').innerText = siap;
    document.getElementById('badge-count-selesai').innerText = selesai;

    const totalIncome = orders
      .filter(o => o.paymentStatus === 'Berhasil')
      .reduce((sum, o) => sum + o.total, 0);
    document.getElementById('stat-pendapatan').innerText = AdminDB.formatRupiah(totalIncome);

    // Recent orders table
    const tbody = document.getElementById('recent-orders-tbody');
    const badgeColors = {
      'Menunggu': 'badge-yellow',
      'Diproses': 'badge-blue',
      'Siap Diambil': 'badge-purple',
      'Selesai': 'badge-green',
      'Dibatalkan': 'badge-red'
    };

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #a8a29e;">Belum ada pesanan masuk.</td></tr>`;
    } else {
      tbody.innerHTML = orders.slice(0, 5).map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customerName}</td>
          <td style="color: #78716c;">${o.createdAt}</td>
          <td><strong>${AdminDB.formatRupiah(o.total)}</strong></td>
          <td>
            <span class="badge ${badgeColors[o.orderStatus] || 'badge-yellow'}">
              ● ${o.orderStatus}
            </span>
          </td>
          <td style="text-align: right;">
            <a href="kelola_pesanan.html" class="btn btn-secondary btn-sm">Detail</a>
          </td>
        </tr>
      `).join('');
    }
