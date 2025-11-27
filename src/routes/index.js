const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const kategoriObatRoutes = require('./kategoriObatRoutes');
const satuanRoutes = require('./satuanRoutes');
const supplierRoutes = require('./supplierRoutes');
const golonganObatRoutes = require('./golonganObatRoutes');
const bentukSediaanRoutes = require('./bentukSediaanRoutes');
const jabatanRoutes = require('./jabatanRoutes');
const unitKerjaRoutes = require('./unitKerjaRoutes');
const pegawaiRoutes = require('./pegawaiRoutes');
const customerRoutes = require('./customerRoutes');
const obatRoutes = require('./obatRoutes');
const transaksiRoutes = require('./transaksiRoutes');
const pembelianObatRoutes = require('./pembelianObatRoutes');
const riwayatStokRoutes = require('./riwayatStokRoutes');
const activityLogRoutes = require('./activityLogRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend KFA API is running',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Backend KFA API',
    version: '1.0.0',
    description: 'RESTful API for KFA application',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health',
      // Master Data
      kategoriObat: '/api/kategori-obat',
      satuan: '/api/satuan',
      supplier: '/api/supplier',
      golonganObat: '/api/golongan-obat',
      bentukSediaan: '/api/bentuk-sediaan',
      jabatan: '/api/jabatan',
      unitKerja: '/api/unit-kerja',
      // Main Data
      pegawai: '/api/pegawai',
      customer: '/api/customer',
      obat: '/api/obat',
      // Transactions
      transaksi: '/api/transaksi',
      pembelianObat: '/api/pembelian-obat',
      riwayatStok: '/api/riwayat-stok',
      // Logs
      activityLogs: '/api/activity-logs',
      // Dashboard
      dashboard: '/api/dashboard',
    },
  });
});

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Master Data routes
router.use('/kategori-obat', kategoriObatRoutes);
router.use('/satuan', satuanRoutes);
router.use('/supplier', supplierRoutes);
router.use('/golongan-obat', golonganObatRoutes);
router.use('/bentuk-sediaan', bentukSediaanRoutes);
router.use('/jabatan', jabatanRoutes);
router.use('/unit-kerja', unitKerjaRoutes);

// Main Data routes
router.use('/pegawai', pegawaiRoutes);
router.use('/customer', customerRoutes);
router.use('/obat', obatRoutes);

// Transaction routes
router.use('/transaksi', transaksiRoutes);
router.use('/pembelian-obat', pembelianObatRoutes);
router.use('/riwayat-stok', riwayatStokRoutes);

// Activity Log routes
router.use('/activity-logs', activityLogRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

module.exports = router;
