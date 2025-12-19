const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  //   getAll,
  //   getOne,
  //   // update,
  //   deleteProduct,
} = require("../controllers/properties");

router.post("/create", verifyJwtToken, create);
// router.get("/getAll", verifyJwtToken, getAll);
// router.get("/get/:id", verifyJwtToken, getOne);
// // router.put("/update/:id", isAdmin, update);
// router.delete("/delete/:id", isAdmin, deleteProduct);

module.exports = router;
