const express = require("express");

const router = express.Router();

const {
  getDamagedAssets,
  markAssetDamaged,
} = require("../controllers/damagedController");

router.get("/", getDamagedAssets);

router.post("/", markAssetDamaged);

module.exports = router;
