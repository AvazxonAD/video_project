const { Router } = require("express");
const router = Router();
const { protect } = require('../middleware/auth')
const upload = require('../utils/protect.file')

const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getByIdPost,
} = require("./post.controller");

router.post("/", protect, upload.single('image'), createPost);
router.get("/", protect,  getPost);
router.put("/:id", protect, upload.single('image'), updatePost);
router.delete("/:id", protect, deletePost);
router.get("/:id", protect,  getByIdPost);

module.exports = router;
