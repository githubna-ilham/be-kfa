const {
  Transaksi,
  DetailTransaksi,
  PembelianObat,
  DetailPembelianObat,
  Obat,
  Customer,
  Pegawai,
  Supplier,
  User,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

// Get dashboard summary statistics
const getDashboardSummary = async (req, res) => {
  try {
    // Get date range from query params (default: current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startDate = req.query.startDate ? new Date(req.query.startDate) : startOfMonth;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : endOfMonth;

    // Get total counts
    const [
      totalObat,
      totalCustomer,
      totalSupplier,
      totalPegawai,
      totalUser,
    ] = await Promise.all([
      Obat.count({ where: { isActive: true } }),
      Customer.count({ where: { isActive: true } }),
      Supplier.count({ where: { isActive: true } }),
      Pegawai.count({ where: { status: 'aktif' } }),
      User.count({ where: { isActive: true } }),
    ]);

    // Get transaction statistics for the period
    const transaksiStats = await Transaksi.findAll({
      where: {
        tanggalTransaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransaksi'],
        [sequelize.fn('SUM', sequelize.col('grandTotal')), 'totalPendapatan'],
        [sequelize.fn('AVG', sequelize.col('grandTotal')), 'rataRataTransaksi'],
      ],
      raw: true,
    });

    // Get purchase statistics for the period
    const pembelianStats = await PembelianObat.findAll({
      where: {
        tanggalPembelian: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalPembelian'],
        [sequelize.fn('SUM', sequelize.col('grandTotal')), 'totalPengeluaran'],
      ],
      raw: true,
    });

    // Get transaction count by status
    const transaksiByStatus = await Transaksi.findAll({
      where: {
        tanggalTransaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Get low stock medicines (stok <= stokMinimal)
    const lowStockCount = await Obat.count({
      where: {
        isActive: true,
        stok: {
          [Op.lte]: sequelize.col('stokMinimal'),
        },
      },
    });

    // Get expired medicines
    const expiredCount = await Obat.count({
      where: {
        isActive: true,
        tanggalKadaluarsa: {
          [Op.lt]: now,
        },
      },
    });

    // Get medicines expiring soon (within 30 days)
    const expiringSoonCount = await Obat.count({
      where: {
        isActive: true,
        tanggalKadaluarsa: {
          [Op.between]: [now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)],
        },
      },
    });

    res.json({
      success: true,
      data: {
        periode: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
        totalData: {
          obat: totalObat,
          customer: totalCustomer,
          supplier: totalSupplier,
          pegawai: totalPegawai,
          user: totalUser,
        },
        transaksi: {
          total: parseInt(transaksiStats[0]?.totalTransaksi || 0),
          pendapatan: parseFloat(transaksiStats[0]?.totalPendapatan || 0),
          rataRata: parseFloat(transaksiStats[0]?.rataRataTransaksi || 0),
          byStatus: transaksiByStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.count);
            return acc;
          }, {}),
        },
        pembelian: {
          total: parseInt(pembelianStats[0]?.totalPembelian || 0),
          pengeluaran: parseFloat(pembelianStats[0]?.totalPengeluaran || 0),
        },
        stokAlert: {
          lowStock: lowStockCount,
          expired: expiredCount,
          expiringSoon: expiringSoonCount,
        },
      },
    });
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard summary',
      error: error.message,
    });
  }
};

// Get sales chart data (daily/weekly/monthly)
const getSalesChart = async (req, res) => {
  try {
    const { period = 'daily', days = 7 } = req.query;
    const now = new Date();
    let startDate;
    let groupFormat;
    let dateFormat;

    if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      groupFormat = sequelize.fn('TO_CHAR', sequelize.col('tanggalTransaksi'), 'YYYY-MM');
      dateFormat = 'YYYY-MM';
    } else if (period === 'weekly') {
      startDate = new Date(now.getTime() - parseInt(days) * 7 * 24 * 60 * 60 * 1000);
      groupFormat = sequelize.fn('TO_CHAR', sequelize.col('tanggalTransaksi'), 'IYYY-IW');
      dateFormat = 'IYYY-IW';
    } else {
      startDate = new Date(now.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);
      groupFormat = sequelize.fn('TO_CHAR', sequelize.col('tanggalTransaksi'), 'YYYY-MM-DD');
      dateFormat = 'YYYY-MM-DD';
    }

    const salesData = await Transaksi.findAll({
      where: {
        tanggalTransaksi: {
          [Op.gte]: startDate,
        },
        status: 'completed',
      },
      attributes: [
        [groupFormat, 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransaksi'],
        [sequelize.fn('SUM', sequelize.col('grandTotal')), 'totalPendapatan'],
      ],
      group: [groupFormat],
      order: [[groupFormat, 'ASC']],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        period,
        startDate: startDate.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
        chart: salesData.map(item => ({
          date: item.date,
          totalTransaksi: parseInt(item.totalTransaksi),
          totalPendapatan: parseFloat(item.totalPendapatan || 0),
        })),
      },
    });
  } catch (error) {
    console.error('Error getting sales chart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sales chart data',
      error: error.message,
    });
  }
};

// Get top selling products
const getTopProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : now;

    const topProducts = await DetailTransaksi.findAll({
      attributes: [
        'obatId',
        [sequelize.fn('SUM', sequelize.col('DetailTransaksi.qty')), 'totalTerjual'],
        [sequelize.fn('SUM', sequelize.col('DetailTransaksi.subtotal')), 'totalPendapatan'],
      ],
      include: [
        {
          model: Transaksi,
          as: 'transaksi',
          attributes: [],
          where: {
            tanggalTransaksi: {
              [Op.between]: [start, end],
            },
            status: 'completed',
          },
        },
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kodeObat', 'namaObat', 'stok', 'hargaJual'],
        },
      ],
      group: ['DetailTransaksi.obatId', 'obat.id'],
      order: [[sequelize.fn('SUM', sequelize.col('DetailTransaksi.qty')), 'DESC']],
      limit: parseInt(limit),
      raw: false,
    });

    res.json({
      success: true,
      data: {
        periode: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
        },
        products: topProducts.map((item, index) => ({
          rank: index + 1,
          obat: item.obat,
          totalTerjual: parseInt(item.dataValues.totalTerjual),
          totalPendapatan: parseFloat(item.dataValues.totalPendapatan),
        })),
      },
    });
  } catch (error) {
    console.error('Error getting top products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top products',
      error: error.message,
    });
  }
};

// Get low stock alerts
const getLowStockAlerts = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const lowStockItems = await Obat.findAll({
      where: {
        isActive: true,
        stok: {
          [Op.lte]: sequelize.col('stokMinimal'),
        },
      },
      attributes: ['id', 'kodeObat', 'namaObat', 'stok', 'stokMinimal', 'hargaBeli', 'hargaJual'],
      order: [['stok', 'ASC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        count: lowStockItems.length,
        items: lowStockItems.map(item => ({
          ...item.toJSON(),
          kekurangan: item.stokMinimal - item.stok,
        })),
      },
    });
  } catch (error) {
    console.error('Error getting low stock alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock alerts',
      error: error.message,
    });
  }
};

// Get expiring medicines
const getExpiringMedicines = async (req, res) => {
  try {
    const { days = 30, limit = 20 } = req.query;
    const now = new Date();
    const futureDate = new Date(now.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);

    const expiringItems = await Obat.findAll({
      where: {
        isActive: true,
        tanggalKadaluarsa: {
          [Op.between]: [now, futureDate],
        },
      },
      attributes: ['id', 'kodeObat', 'namaObat', 'stok', 'noBatch', 'tanggalKadaluarsa', 'hargaJual'],
      order: [['tanggalKadaluarsa', 'ASC']],
      limit: parseInt(limit),
    });

    const expiredItems = await Obat.findAll({
      where: {
        isActive: true,
        tanggalKadaluarsa: {
          [Op.lt]: now,
        },
      },
      attributes: ['id', 'kodeObat', 'namaObat', 'stok', 'noBatch', 'tanggalKadaluarsa', 'hargaJual'],
      order: [['tanggalKadaluarsa', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        expiringSoon: {
          count: expiringItems.length,
          days: parseInt(days),
          items: expiringItems.map(item => ({
            ...item.toJSON(),
            daysUntilExpiry: Math.ceil((new Date(item.tanggalKadaluarsa) - now) / (1000 * 60 * 60 * 24)),
          })),
        },
        expired: {
          count: expiredItems.length,
          items: expiredItems.map(item => ({
            ...item.toJSON(),
            daysExpired: Math.ceil((now - new Date(item.tanggalKadaluarsa)) / (1000 * 60 * 60 * 24)),
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error getting expiring medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expiring medicines',
      error: error.message,
    });
  }
};

// Get recent transactions
const getRecentTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentTransaksi = await Transaksi.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama'],
        },
      ],
      order: [['tanggalTransaksi', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: recentTransaksi,
    });
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent transactions',
      error: error.message,
    });
  }
};

// Get payment method distribution
const getPaymentMethodStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : now;

    const paymentStats = await Transaksi.findAll({
      where: {
        tanggalTransaksi: {
          [Op.between]: [start, end],
        },
        status: 'completed',
      },
      attributes: [
        'metodePembayaran',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('grandTotal')), 'total'],
      ],
      group: ['metodePembayaran'],
      raw: true,
    });

    const totalCount = paymentStats.reduce((acc, item) => acc + parseInt(item.count), 0);
    const totalAmount = paymentStats.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

    res.json({
      success: true,
      data: {
        periode: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
        },
        summary: {
          totalTransaksi: totalCount,
          totalPendapatan: totalAmount,
        },
        distribution: paymentStats.map(item => ({
          metodePembayaran: item.metodePembayaran,
          count: parseInt(item.count),
          total: parseFloat(item.total || 0),
          percentage: totalCount > 0 ? ((parseInt(item.count) / totalCount) * 100).toFixed(2) : 0,
        })),
      },
    });
  } catch (error) {
    console.error('Error getting payment method stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment method statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
  getSalesChart,
  getTopProducts,
  getLowStockAlerts,
  getExpiringMedicines,
  getRecentTransactions,
  getPaymentMethodStats,
};
