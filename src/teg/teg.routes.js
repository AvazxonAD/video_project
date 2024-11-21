const { Router } = require("express");
const router = Router();
const { protect } = require('../middleware/auth')
const {
  createteg,
  getteg,
  updateteg,
  deleteteg,
  getByIdteg,
} = require("./teg.controller");

router.get("/", protect, getteg);
router.post("/", protect, createteg);
router.put("/:id", protect, updateteg);
router.delete("/:id", protect, deleteteg);
router.get("/:id", protect, getByIdteg);

module.exports = router;
