const express = require("express");

const router = express.Router();

const {
  getAllAssets,
  createAssets,
} = require("../controllers/assetsController");

router.get("/", getAllAssets);

router.post("/", createAssets);

module.exports = router;
