const db = require("../database/db");

const getAllAssets = (req, res) => {
  try {
    const assets = db
      .prepare(
        `
        SELECT
          assets.*,
          pr_master.pr_no,
          pr_master.po_no
        FROM assets
        JOIN pr_master
        ON assets.pr_id = pr_master.id
      `,
      )
      .all();

    res.json(assets);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch assets",
    });
  }
};

const createAssets = (req, res) => {
  try {
    const { prNo, poNo, items } = req.body;

    if (!prNo) {
      return res.status(400).json({
        error: "PR Number is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Items are required",
      });
    }

    // Create PR
    const prStmt = db.prepare(`
      INSERT INTO pr_master (
        pr_no,
        po_no,
        total_items
      )
      VALUES (?, ?, ?)
    `);

    const prResult = prStmt.run(prNo, poNo || null, items.length);

    const prId = prResult.lastInsertRowid;

    // Asset Insert Statement
    const assetStmt = db.prepare(`
      INSERT INTO assets (
        pr_id,
        item_name,
        item_code,
        description,
        serial_number,
        is_ilms,
        date_added,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      assetStmt.run(
        prId,
        item.name,
        item.itemCode,
        item.description,
        item.serialNumber,
        item.isILMS === "Yes" ? 1 : 0,
        item.dateAdded,
        "Available",
      );
    }

    res.status(201).json({
      message: "Assets created successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllAssets,
  createAssets,
};
