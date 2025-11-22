const { Pegawai, Jabatan, UnitKerja, User } = require('../models');

// Get all pegawai
const getAllPegawai = async (req, res) => {
  try {
    const pegawai = await Pegawai.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role', 'isActive'],
        },
        {
          model: Jabatan,
          as: 'jabatan',
          attributes: ['id', 'nama_jabatan'],
        },
        {
          model: UnitKerja,
          as: 'unitKerja',
          attributes: ['id', 'nama_unit'],
        },
      ],
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: pegawai,
    });
  } catch (error) {
    console.error('Error getting pegawai:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pegawai',
      error: error.message,
    });
  }
};

// Get pegawai by ID
const getPegawaiById = async (req, res) => {
  try {
    const { id } = req.params;
    const pegawai = await Pegawai.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role', 'isActive', 'fullName'],
        },
        {
          model: Jabatan,
          as: 'jabatan',
          attributes: ['id', 'nama_jabatan'],
        },
        {
          model: UnitKerja,
          as: 'unitKerja',
          attributes: ['id', 'nama_unit'],
        },
      ],
    });

    if (!pegawai) {
      return res.status(404).json({
        success: false,
        message: 'Pegawai not found',
      });
    }

    res.json({
      success: true,
      data: pegawai,
    });
  } catch (error) {
    console.error('Error getting pegawai:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pegawai',
      error: error.message,
    });
  }
};

// Create pegawai
const createPegawai = async (req, res) => {
  try {
    const {
      userId,
      nip,
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      alamat,
      noTelp,
      email,
      jabatanId,
      unitKerjaId,
      tanggalMasuk,
      status,
    } = req.body;

    if (!nip || !nama || !jabatanId || !unitKerjaId) {
      return res.status(400).json({
        success: false,
        message: 'NIP, nama, jabatan_id, and unit_kerja_id are required',
      });
    }

    const pegawai = await Pegawai.create({
      userId,
      nip,
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      alamat,
      noTelp,
      email,
      jabatanId,
      unitKerjaId,
      tanggalMasuk,
      status: status || 'aktif',
    });

    const pegawaiWithRelations = await Pegawai.findByPk(pegawai.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role', 'isActive'],
        },
        {
          model: Jabatan,
          as: 'jabatan',
          attributes: ['id', 'nama_jabatan'],
        },
        {
          model: UnitKerja,
          as: 'unitKerja',
          attributes: ['id', 'nama_unit'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Pegawai created successfully',
      data: pegawaiWithRelations,
    });
  } catch (error) {
    console.error('Error creating pegawai:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pegawai',
      error: error.message,
    });
  }
};

// Update pegawai
const updatePegawai = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      nip,
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      alamat,
      noTelp,
      email,
      jabatanId,
      unitKerjaId,
      tanggalMasuk,
      status,
    } = req.body;

    const pegawai = await Pegawai.findByPk(id);

    if (!pegawai) {
      return res.status(404).json({
        success: false,
        message: 'Pegawai not found',
      });
    }

    await pegawai.update({
      userId: userId !== undefined ? userId : pegawai.userId,
      nip: nip || pegawai.nip,
      nama: nama || pegawai.nama,
      jenisKelamin: jenisKelamin !== undefined ? jenisKelamin : pegawai.jenisKelamin,
      tempatLahir: tempatLahir !== undefined ? tempatLahir : pegawai.tempatLahir,
      tanggalLahir: tanggalLahir !== undefined ? tanggalLahir : pegawai.tanggalLahir,
      alamat: alamat !== undefined ? alamat : pegawai.alamat,
      noTelp: noTelp !== undefined ? noTelp : pegawai.noTelp,
      email: email !== undefined ? email : pegawai.email,
      jabatanId: jabatanId || pegawai.jabatanId,
      unitKerjaId: unitKerjaId || pegawai.unitKerjaId,
      tanggalMasuk: tanggalMasuk !== undefined ? tanggalMasuk : pegawai.tanggalMasuk,
      status: status !== undefined ? status : pegawai.status,
    });

    const pegawaiWithRelations = await Pegawai.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role', 'isActive'],
        },
        {
          model: Jabatan,
          as: 'jabatan',
          attributes: ['id', 'nama_jabatan'],
        },
        {
          model: UnitKerja,
          as: 'unitKerja',
          attributes: ['id', 'nama_unit'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Pegawai updated successfully',
      data: pegawaiWithRelations,
    });
  } catch (error) {
    console.error('Error updating pegawai:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pegawai',
      error: error.message,
    });
  }
};

// Delete pegawai
const deletePegawai = async (req, res) => {
  try {
    const { id } = req.params;

    const pegawai = await Pegawai.findByPk(id);

    if (!pegawai) {
      return res.status(404).json({
        success: false,
        message: 'Pegawai not found',
      });
    }

    await pegawai.destroy();

    res.json({
      success: true,
      message: 'Pegawai deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pegawai:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pegawai',
      error: error.message,
    });
  }
};

module.exports = {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
};
