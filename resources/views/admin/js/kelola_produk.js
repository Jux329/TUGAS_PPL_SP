/**
 * kelola_produk.js - Admin UMKM Culinary's NTT
 * Berisi helper data global (AdminDB, render sidebar) + logika khusus halaman kelola_produk.html.
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

/* ===== Logika khusus halaman kelola_produk.html (dipindahkan dari <script> inline) ===== */
// Check auth
    if (!AdminDB.checkAuth()) {
      window.location.href = 'login.html';
    }

    renderAdminSidebar('produk');

    let allProducts = [];
    let editingProductId = null;

    function renderProductsGrid() {
      const searchVal = document.getElementById('search-product').value.toLowerCase();
      const categoryFilter = document.getElementById('category-filter').value;
      const statusFilter = document.getElementById('status-filter-product').value;

      allProducts = AdminDB.getProducts();

      const filtered = allProducts.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchVal) || 
                           product.description.toLowerCase().includes(searchVal);
        const matchCategory = !categoryFilter || product.category === categoryFilter;
        const matchStatus = !statusFilter || product.status === statusFilter;
        return matchSearch && matchCategory && matchStatus;
      });

      const container = document.getElementById('products-container');
      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px;">
            <div style="font-size: 40px; margin-bottom: 12px;">🍗</div>
            <h3 style="font-size: 18px; font-weight: 800; color: #0c0a09;">Tidak Ada Produk</h3>
            <p style="font-size: 13px; color: #78716c; margin: 8px 0 20px;">Tambahkan produk kuliner baru untuk toko Anda.</p>
            <button onclick="openProductModal()" class="btn btn-primary">+ Tambah Produk</button>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(product => `
        <div style="border: 1px solid #f5f5f4; border-radius: 16px; overflow: hidden; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s;">
          <div style="height: 180px; background: #f5f5f4; overflow: hidden; position: relative;">
            <img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 10px; right: 10px; background: ${product.status === 'Aktif' ? '#dcfce7' : '#fee2e2'}; color: ${product.status === 'Aktif' ? '#15803d' : '#b91c1c'}; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
              ${product.status}
            </div>
          </div>

          <div style="padding: 16px;">
            <div style="font-size: 12px; color: #78716c; margin-bottom: 4px; text-transform: uppercase; font-weight: 700;">${product.category}</div>
            <h3 style="font-size: 16px; font-weight: 800; color: #0c0a09; margin-bottom: 8px; line-height: 1.3;">${product.name}</h3>
            
            <p style="font-size: 12px; color: #78716c; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${product.description}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #f5f5f4; border-bottom: 1px solid #f5f5f4; margin-bottom: 12px;">
              <div>
                <div style="font-size: 11px; color: #78716c; font-weight: 600;">Harga</div>
                <div style="font-size: 17px; font-weight: 800; color: #ea580c;">${AdminDB.formatRupiah(product.price)}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: #78716c; font-weight: 600;">Stok</div>
                <div style="font-size: 17px; font-weight: 800; color: #0c0a09;">${product.stock}</div>
              </div>
            </div>

            <div style="display: flex; gap: 8px;">
              <button onclick="editProduct('${product.id}')" class="btn btn-secondary btn-xs" style="flex: 1;">Edit</button>
              <button onclick="deleteProduct('${product.id}')" class="btn btn-secondary btn-xs" style="flex: 1; color: #dc2626;">Hapus</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function loadCategories() {
      const categories = AdminDB.getCategories();
      const select = document.getElementById('prod-category');
      const filterSelect = document.getElementById('category-filter');

      const options = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
      select.innerHTML = '<option value="">-- Pilih Kategori --</option>' + options;
      
      const filterOptions = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
      filterSelect.innerHTML = '<option value="">Semua Kategori</option>' + filterOptions;
    }

    function openProductModal() {
      editingProductId = null;
      document.getElementById('modal-title').innerText = 'Tambah Produk Baru';
      document.getElementById('product-form').reset();
      document.getElementById('product-modal').classList.add('active');
    }

    function editProduct(productId) {
      editingProductId = productId;
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;

      document.getElementById('modal-title').innerText = 'Edit Produk';
      document.getElementById('prod-name').value = product.name;
      document.getElementById('prod-category').value = product.category;
      document.getElementById('prod-price').value = product.price;
      document.getElementById('prod-stock').value = product.stock;
      document.getElementById('prod-status').value = product.status;
      document.getElementById('prod-desc').value = product.description;
      document.getElementById('prod-image').value = product.image;
      
      document.getElementById('product-modal').classList.add('active');
    }

    function closeProductModal() {
      document.getElementById('product-modal').classList.remove('active');
      editingProductId = null;
    }

    function deleteProduct(productId) {
      if (confirm('Yakin ingin menghapus produk ini?')) {
        allProducts = allProducts.filter(p => p.id !== productId);
        AdminDB.saveProducts(allProducts);
        renderProductsGrid();
      }
    }

    document.getElementById('product-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const productData = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: parseInt(document.getElementById('prod-price').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        status: document.getElementById('prod-status').value,
        description: document.getElementById('prod-desc').value,
        image: document.getElementById('prod-image').value || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
      };

      if (editingProductId) {
        const idx = allProducts.findIndex(p => p.id === editingProductId);
        if (idx !== -1) {
          allProducts[idx] = { ...allProducts[idx], ...productData };
          alert('Produk berhasil diperbarui!');
        }
      } else {
        const newProduct = {
          id: 'prod-' + Date.now(),
          ...productData
        };
        allProducts.push(newProduct);
        alert('Produk berhasil ditambahkan!');
      }

      AdminDB.saveProducts(allProducts);
      closeProductModal();
      renderProductsGrid();
    });

    document.getElementById('search-product').addEventListener('input', renderProductsGrid);
    document.getElementById('category-filter').addEventListener('change', renderProductsGrid);
    document.getElementById('status-filter-product').addEventListener('change', renderProductsGrid);

    loadCategories();
    renderProductsGrid();
