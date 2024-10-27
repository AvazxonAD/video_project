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

router.post("/", protect, upload.single('file'), createPost);
router.get("/", getPost);
router.put("/:id", protect, upload.single('file'), updatePost);
router.delete("/:id", protect, deletePost);
router.get("/:id", getByIdPost);

module.exports = router;
