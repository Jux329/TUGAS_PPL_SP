document.addEventListener('DOMContentLoaded', function () {

  // Hapus data login customer (key yang benar-benar dipakai di seluruh halaman)
  localStorage.removeItem('ntt_current_customer');

  // Hapus juga key lama, jaga-jaga kalau pernah dipakai versi sebelumnya
  localStorage.removeItem('customer_current_user');
  localStorage.removeItem('customer_logged_in');

});
