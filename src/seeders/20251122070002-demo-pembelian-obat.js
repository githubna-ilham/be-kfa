'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert PembelianObat
    const pembelianObats = [
      {
        noFaktur: 'PO-2025110001',
        tanggalPembelian: new Date('2025-11-01 08:00:00'),
        supplierId: 1,
        pegawaiId: 1,
        totalHarga: 2500000,
        diskon: 100000,
        grandTotal: 2400000,
        status: 'completed',
        keterangan: 'Pembelian stok awal bulan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110002',
        tanggalPembelian: new Date('2025-11-05 09:30:00'),
        supplierId: 2,
        pegawaiId: 1,
        totalHarga: 1800000,
        diskon: 0,
        grandTotal: 1800000,
        status: 'completed',
        keterangan: 'Restok obat generik',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110003',
        tanggalPembelian: new Date('2025-11-10 10:00:00'),
        supplierId: 3,
        pegawaiId: 2,
        totalHarga: 3200000,
        diskon: 200000,
        grandTotal: 3000000,
        status: 'completed',
        keterangan: 'Pembelian obat branded',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110004',
        tanggalPembelian: new Date('2025-11-15 11:00:00'),
        supplierId: 1,
        pegawaiId: 1,
        totalHarga: 1500000,
        diskon: 50000,
        grandTotal: 1450000,
        status: 'completed',
        keterangan: 'Restok rutin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110005',
        tanggalPembelian: new Date('2025-11-20 14:00:00'),
        supplierId: 4,
        pegawaiId: 2,
        totalHarga: 2100000,
        diskon: 100000,
        grandTotal: 2000000,
        status: 'completed',
        keterangan: 'Pembelian vitamin dan suplemen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110006',
        tanggalPembelian: new Date('2025-11-25 08:30:00'),
        supplierId: 2,
        pegawaiId: 1,
        totalHarga: 950000,
        diskon: 0,
        grandTotal: 950000,
        status: 'pending',
        keterangan: 'Menunggu pengiriman',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        noFaktur: 'PO-2025110007',
        tanggalPembelian: new Date('2025-11-26 09:00:00'),
        supplierId: 5,
        pegawaiId: 2,
        totalHarga: 1200000,
        diskon: 0,
        grandTotal: 1200000,
        status: 'cancelled',
        keterangan: 'Dibatalkan - stok supplier habis',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('PembelianObats', pembelianObats);

    // Insert DetailPembelianObat
    const detailPembelianObats = [
      // PO-2025110001
      { pembelianObatId: 1, obatId: 1, qty: 200, hargaBeli: 5000, subtotal: 1000000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 1, obatId: 2, qty: 100, hargaBeli: 10000, subtotal: 1000000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 1, obatId: 3, qty: 25, hargaBeli: 20000, subtotal: 500000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110002
      { pembelianObatId: 2, obatId: 4, qty: 80, hargaBeli: 10000, subtotal: 800000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 2, obatId: 5, qty: 50, hargaBeli: 20000, subtotal: 1000000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110003
      { pembelianObatId: 3, obatId: 6, qty: 60, hargaBeli: 15000, subtotal: 900000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 3, obatId: 7, qty: 100, hargaBeli: 8000, subtotal: 800000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 3, obatId: 8, qty: 50, hargaBeli: 25000, subtotal: 1250000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 3, obatId: 9, qty: 50, hargaBeli: 5000, subtotal: 250000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110004
      { pembelianObatId: 4, obatId: 10, qty: 50, hargaBeli: 15000, subtotal: 750000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 4, obatId: 1, qty: 150, hargaBeli: 5000, subtotal: 750000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110005
      { pembelianObatId: 5, obatId: 2, qty: 70, hargaBeli: 10000, subtotal: 700000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 5, obatId: 3, qty: 30, hargaBeli: 20000, subtotal: 600000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 5, obatId: 4, qty: 40, hargaBeli: 10000, subtotal: 400000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 5, obatId: 5, qty: 20, hargaBeli: 20000, subtotal: 400000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110006 (pending)
      { pembelianObatId: 6, obatId: 6, qty: 30, hargaBeli: 15000, subtotal: 450000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 6, obatId: 7, qty: 50, hargaBeli: 8000, subtotal: 400000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 6, obatId: 9, qty: 20, hargaBeli: 5000, subtotal: 100000, createdAt: new Date(), updatedAt: new Date() },
      // PO-2025110007 (cancelled)
      { pembelianObatId: 7, obatId: 8, qty: 40, hargaBeli: 25000, subtotal: 1000000, createdAt: new Date(), updatedAt: new Date() },
      { pembelianObatId: 7, obatId: 10, qty: 20, hargaBeli: 10000, subtotal: 200000, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('DetailPembelianObats', detailPembelianObats);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DetailPembelianObats', null, {});
    await queryInterface.bulkDelete('PembelianObats', null, {});
  },
};
