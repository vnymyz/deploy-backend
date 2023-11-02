const express = require("express");
const router = express.Router();
const {
  createKategori,
  showKategori,
  showSingleKategori,
  updateKategori,
  deleteKategori,
} = require("../controllers/kategoriController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Kategori Routes
router.post("/kategori/create", isAuthenticated, isAdmin, createKategori);
router.get("/kategori/show", showKategori);
router.get("/kategori/:id", showSingleKategori);
router.put("/kategori/:id", isAuthenticated, isAdmin, updateKategori);
router.delete("/delete/kategori/:id", isAuthenticated, isAdmin, deleteKategori);

module.exports = router;
