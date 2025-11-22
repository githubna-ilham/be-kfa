const { Supplier } = require('../models');

// Get all supplier
const getAllSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error('Error getting supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supplier',
      error: error.message,
    });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error('Error getting supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supplier',
      error: error.message,
    });
  }
};

// Create supplier
const createSupplier = async (req, res) => {
  try {
    const { nama_supplier, alamat, telepon, email, keterangan } = req.body;

    if (!nama_supplier) {
      return res.status(400).json({
        success: false,
        message: 'Nama supplier is required',
      });
    }

    const supplier = await Supplier.create({
      nama_supplier,
      alamat,
      telepon,
      email,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier,
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create supplier',
      error: error.message,
    });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_supplier, alamat, telepon, email, keterangan } = req.body;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    await supplier.update({
      nama_supplier: nama_supplier || supplier.nama_supplier,
      alamat: alamat !== undefined ? alamat : supplier.alamat,
      telepon: telepon !== undefined ? telepon : supplier.telepon,
      email: email !== undefined ? email : supplier.email,
      keterangan: keterangan !== undefined ? keterangan : supplier.keterangan,
    });

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier,
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supplier',
      error: error.message,
    });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    await supplier.destroy();

    res.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete supplier',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSupplier,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
