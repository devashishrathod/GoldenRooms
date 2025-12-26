const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  getAll,
  get,
  // update,
  deleteProperty,
} = require("../controllers/properties");

router.post("/create", verifyJwtToken, create);
router.get("/getAll", getAll);
router.get("/get/:id", get);
//  router.put("/update/:id", verifyJwtToken, update);
router.delete("/delete/:id", verifyJwtToken, deleteProperty);

module.exports = router;
