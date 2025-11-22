const { Customer } = require('../models');

// Get all customer
const getAllCustomer = async (req, res) => {
  try {
    const customer = await Customer.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer',
      error: error.message,
    });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer',
      error: error.message,
    });
  }
};

// Create customer
const createCustomer = async (req, res) => {
  try {
    const {
      nama_customer,
      jenis_kelamin,
      tanggal_lahir,
      alamat,
      telepon,
      email,
    } = req.body;

    if (!nama_customer) {
      return res.status(400).json({
        success: false,
        message: 'Nama customer is required',
      });
    }

    const customer = await Customer.create({
      nama_customer,
      jenis_kelamin,
      tanggal_lahir,
      alamat,
      telepon,
      email,
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message,
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_customer,
      jenis_kelamin,
      tanggal_lahir,
      alamat,
      telepon,
      email,
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    await customer.update({
      nama_customer: nama_customer || customer.nama_customer,
      jenis_kelamin: jenis_kelamin !== undefined ? jenis_kelamin : customer.jenis_kelamin,
      tanggal_lahir: tanggal_lahir !== undefined ? tanggal_lahir : customer.tanggal_lahir,
      alamat: alamat !== undefined ? alamat : customer.alamat,
      telepon: telepon !== undefined ? telepon : customer.telepon,
      email: email !== undefined ? email : customer.email,
    });

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message,
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    await customer.destroy();

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
