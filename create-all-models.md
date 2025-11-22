# Summary Model Sistem Transaksi Farmasi

Dokumen ini berisi ringkasan semua model yang akan dibuat untuk sistem transaksi.

## 1. Model Obat
**Fields:**
- kodeObat (unique, required)
- namaObat (required)
- kategoriObatId (FK -> KategoriObats)
- golonganObatId (FK -> GolonganObats)
- bentukSediaanId (FK -> BentukSediaans)
- satuanId (FK -> Satuans)
- supplierId (FK -> Suppliers, optional)
- stok (integer, default 0)
- hargaBeli (decimal)
- hargaJual (decimal)
- tanggalKadaluarsa (date)
- deskripsi (text)
- isActive (boolean, default true)

## 2. Model Customer
**Fields:**
- kode (unique, required)
- nama (required)
- noTelp
- alamat
- email (unique)
- tanggalLahir
- jenisKelamin (ENUM: L/P)
- isActive (boolean, default true)

## 3. Model Transaksi
**Fields:**
- noFaktur (unique, required, auto-generated)
- tanggalTransaksi (required)
- customerId (FK -> Customers, optional - bisa tanpa customer)
- pegawaiId (FK -> Pegawais, required - kasir/apoteker)
- totalHarga (decimal)
- diskon (decimal, default 0)
- grandTotal (decimal)
- metodePembayaran (ENUM: Cash, Transfer, Debit, Kredit)
- status (ENUM: pending, completed, cancelled)

## 4. Model DetailTransaksi
**Fields:**
- transaksiId (FK -> Transaksis, required)
- obatId (FK -> Obats, required)
- qty (integer, required)
- hargaSatuan (decimal)
- subtotal (decimal)
- diskon (decimal, default 0)

## Relasi:
- Obat belongsTo: KategoriObat, GolonganObat, BentukSediaan, Satuan, Supplier
- Customer hasMany: Transaksi
- Pegawai hasMany: Transaksi
- Transaksi belongsTo: Customer, Pegawai
- Transaksi hasMany: DetailTransaksi
- DetailTransaksi belongsTo: Transaksi, Obat
- Obat hasMany: DetailTransaksi
