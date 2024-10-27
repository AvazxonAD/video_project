const { Router } = require("express");
const router = Router();
const { protect } = require('../middleware/auth')
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getByIdCategory,
} = require("./category.controller");

router.post("/", protect, createCategory);
router.get("/", protect, getCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);
router.get("/:id", protect, getByIdCategory);

module.exports = router;
