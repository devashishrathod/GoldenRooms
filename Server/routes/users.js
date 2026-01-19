const express = require("express");
const router = express.Router();

const { verifyJwtToken } = require("../middlewares");
const { getUser, getAllUsers, updateUser } = require("../controllers/users");

router.get("/get", getUser);
router.get("/get-all", getAllUsers);
router.put("/update", verifyJwtToken, updateUser);

module.exports = router;
