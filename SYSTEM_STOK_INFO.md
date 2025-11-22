# Sistem Update Stok Otomatis

## Mekanisme Update Stok

Stok obat akan **otomatis ter-update** ketika transaksi terjadi melalui **Sequelize hooks** di model DetailTransaksi.

### Hooks yang Digunakan:

#### 1. **afterCreate** (Ketika detail transaksi dibuat)
- Mengurangi stok obat sesuai qty yang dibeli
- Validasi: stok harus cukup sebelum transaksi

#### 2. **afterDestroy** (Ketika detail transaksi dihapus)
- Mengembalikan stok obat sesuai qty yang dihapus

#### 3. **afterUpdate** (Ketika qty detail transaksi diubah)
- Menyesuaikan stok obat berdasarkan perubahan qty

### Cara Kerja:

```javascript
// Contoh: Customer beli Paracetamol 10 tablet
// Stok awal: 100

// 1. Buat detail transaksi (qty: 10)
DetailTransaksi.create({
  transaksiId: 1,
  obatId: 5,
  qty: 10
})
// -> Hook afterCreate dijalankan
// -> Stok obat dikurangi 10
// -> Stok menjadi: 90

// 2. Update qty jadi 15
DetailTransaksi.update({ qty: 15 })
// -> Hook afterUpdate dijalankan
// -> Selisih: 15 - 10 = 5
// -> Stok obat dikurangi 5 lagi
// -> Stok menjadi: 85

// 3. Hapus detail transaksi
DetailTransaksi.destroy()
// -> Hook afterDestroy dijalankan
// -> Stok obat ditambah 15 (dikembalikan)
// -> Stok menjadi: 100
```

### Keuntungan:
✅ Stok otomatis ter-update tanpa perlu manual update di controller
✅ Konsisten dan tidak terlupa
✅ Mudah di-maintain
✅ Data integrity terjaga

### Catatan Penting:
⚠️ Transaksi dengan status 'cancelled' TIDAK mengurangi stok
⚠️ Hanya transaksi 'completed' yang mengurangi stok
⚠️ Stok tidak bisa minus (ada validasi)
