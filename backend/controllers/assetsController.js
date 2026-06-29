const db = require("../database/db");

/* =========================
   GET ALL ASSETS
========================= */
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

/* =========================
   CREATE ASSETS
========================= */
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

    const assetStmt = db.prepare(`
  INSERT INTO assets (
    pr_id,
    item_name,
    item_code,
    description,
    serial_number,
    quantity,
    available_quantity,
    issued_quantity,
    is_ilms,
    date_added,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

    for (const item of items) {
      let serialNumber = item.serialNumber?.trim();

      if (
        !serialNumber ||
        serialNumber.toLowerCase() === "n/a" ||
        serialNumber.toLowerCase() === "na"
      ) {
        serialNumber = "N/A";
      } else {
        const duplicate = db
          .prepare(
            `
      SELECT id
      FROM assets
      WHERE serial_number = ?
    `,
          )
          .get(serialNumber);

        if (duplicate) {
          return res.status(400).json({
            error: `Serial Number "${serialNumber}" already exists`,
          });
        }
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          error: "Quantity must be at least 1",
        });
      }

      assetStmt.run(
        prId,
        item.name,
        item.itemCode,
        item.description,
        serialNumber,

        quantity,
        quantity,
        0,

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

/* =========================
   UPDATE ASSET
========================= */
const updateAsset = (req, res) => {
  try {
    const { id } = req.params;

    const {
      prNo,
      poNo,
      item_name,
      item_code,
      description,
      serial_number,
      quantity,
      is_ilms,
    } = req.body;

    const asset = db
      .prepare(
        `
        SELECT *
        FROM assets
        WHERE id = ?
      `,
      )
      .get(id);

    if (!asset) {
      return res.status(404).json({
        error: "Asset not found",
      });
    }
    const newQuantity = Number(quantity);

    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    if (newQuantity < asset.issued_quantity) {
      return res.status(400).json({
        error: `Quantity cannot be less than already issued quantity (${asset.issued_quantity})`,
      });
    }

    const newAvailableQuantity = newQuantity - asset.issued_quantity;

    let finalSerial = serial_number?.trim();

    if (
      !finalSerial ||
      finalSerial.toLowerCase() === "n/a" ||
      finalSerial.toLowerCase() === "na"
    ) {
      finalSerial = "N/A";
    }

    if (finalSerial !== "N/A") {
      const duplicateSerial = db
        .prepare(
          `
      SELECT id
      FROM assets
      WHERE serial_number = ?
      AND id != ?
    `,
        )
        .get(finalSerial, id);

      if (duplicateSerial) {
        return res.status(400).json({
          error: "Serial Number already exists",
        });
      }
    }

    db.prepare(
      `
      UPDATE assets
SET
  item_name = ?,
  item_code = ?,
  description = ?,
  serial_number = ?,
  quantity = ?,
  available_quantity = ?,
  is_ilms = ?
WHERE id = ?
    `,
    ).run(
      item_name,
      item_code,
      description,
      finalSerial,

      newQuantity,
      newAvailableQuantity,

      is_ilms ? 1 : 0,
      id,
    );

    db.prepare(
      `
      UPDATE pr_master
      SET
        pr_no = ?,
        po_no = ?
      WHERE id = ?
    `,
    ).run(prNo, poNo, asset.pr_id);

    res.json({
      message: "Asset updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* =========================
   DELETE ASSET
========================= */
const deleteAsset = (req, res) => {
  try {
    const { id } = req.params;

    db.prepare(
      `
      DELETE FROM damaged_assets
      WHERE asset_id = ?
    `,
    ).run(id);

    db.prepare(
      `
      DELETE FROM issue_history
      WHERE asset_id = ?
    `,
    ).run(id);

    db.prepare(
      `
      DELETE FROM assets
      WHERE id = ?
    `,
    ).run(id);

    res.json({
      message: "Asset deleted successfully",
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
  updateAsset,
  deleteAsset,
};
