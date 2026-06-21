const express = require("express");

const router = express.Router();

const {
  issueAsset,
  getIssuedAssets,
  returnAsset,
  getReturnedAssets,
} = require("../controllers/issueController");

router.post("/", issueAsset);

router.get("/", getIssuedAssets);

router.get("/returned", getReturnedAssets);

router.put("/:id/return", returnAsset);

module.exports = router;
