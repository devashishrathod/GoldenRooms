const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middlewares");
const { create, getAll } = require("../controllers/subscriptions");

router.post("/add", isAdmin, create);
router.get("/get-all", getAll);

module.exports = router;
