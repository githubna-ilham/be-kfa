const { User, Pegawai } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all users with pagination, search, and filters
const getAllUsers = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['username', 'email', 'fullName'],
      allowedFilters: ['role', 'isActive'],
      defaultSort: 'id',
    });

    const { count, rows } = await User.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
      include: [
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email', 'jabatanId', 'unitKerjaId'],
          required: false, // LEFT JOIN - user tanpa pegawai juga ditampilkan
        },
      ],
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email', 'noTelp', 'jabatanId', 'unitKerjaId'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role, isActive } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists',
      });
    }

    // Create user (password akan di-hash otomatis oleh beforeCreate hook)
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user, // password sudah otomatis di-exclude oleh toJSON()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, fullName, role, isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if username or email already exists (exclude current user)
    if (username || email) {
      const { Op } = require('sequelize');
      const whereClause = {
        id: { [Op.ne]: id },
        [Op.or]: [],
      };

      if (username) whereClause[Op.or].push({ username });
      if (email) whereClause[Op.or].push({ email });

      const existingUser = await User.findOne({ where: whereClause });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username
            ? 'Username already exists'
            : 'Email already exists',
        });
      }
    }

    // Update user (password akan di-hash otomatis jika berubah oleh beforeUpdate hook)
    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: password || user.password,
      fullName: fullName !== undefined ? fullName : user.fullName,
      role: role || user.role,
      isActive: isActive !== undefined ? isActive : user.isActive,
    });

    // Reload user dengan relasi
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email', 'noTelp'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has pegawai data
    const pegawai = await Pegawai.findOne({ where: { userId: id } });
    if (pegawai) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with associated pegawai data. Delete pegawai first.',
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
