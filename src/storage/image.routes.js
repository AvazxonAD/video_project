const { Router } = require("express");
const router = Router();
const { protect } = require('../middleware/auth')
const upload = require('../utils/protect.file')
const {
  createimage,
  getimage,
  updateimage,
  deleteimage,
  getByIdimage,
} = require("./image.controller");

router.post("/", protect, upload.single('image'), createimage);
router.get("/", protect, getimage);
router.put("/:id", protect, upload.single('image'), updateimage);
router.delete("/:id", protect, deleteimage);
router.get("/:id", protect, getByIdimage);

module.exports = router;
