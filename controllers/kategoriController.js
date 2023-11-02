const Kategori = require("../models/kategoriModel");

// membuat kategori baru
exports.createKategori = async (req, res, next) => {
  const { namakat } = req.body;

  try {
    const kategori = await Kategori.create({ namakat });
    res.status(201).json({
      success: true,
      kategori,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get semua kategori
exports.showKategori = async (req, res, next) => {
  try {
    const kategori = await Kategori.find();
    res.status(200).json({
      success: true,
      kategori,
    });
  } catch (error) {
    next(error);
  }
};

// Delete kategori by id
exports.deleteKategori = async (req, res, next) => {
  try {
    await Kategori.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

// Get single kategori by id
exports.showSingleKategori = async (req, res, next) => {
  try {
    const kategori = await Kategori.findById(req.params.id);
    res.status(200).json({
      success: true,
      kategori,
    });
  } catch (error) {
    next(error);
  }
};

// update kategori by id
exports.updateKategori = async (req, res, next) => {
  const { namakat } = req.body;

  try {
    const updatedKategori = await Kategori.findByIdAndUpdate(
      req.params.id,
      { namakat },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedKategori,
    });
  } catch (error) {
    next(error);
  }
};
