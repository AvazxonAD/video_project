const { Router } = require("express");
const router = Router();

const {
  getPost,
  getByIdPost
} = require("./user.panel.controller");

router.get("/post", getPost);
router.get("/post/:id", getByIdPost);

module.exports = router;
