const { Router } = require("express");
const router = Router();

const { login} = require("./auth.controller");

router.post(`/login`, login)

module.exports = router;