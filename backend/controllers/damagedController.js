const db = require("../database/db");

const getDamagedAssets = (req, res) => {
  try {
    const damaged = db
      .prepare(
        `
        SELECT
          damaged_assets.*,

          assets.item_name,
          assets.item_code,
          assets.serial_number

        FROM damaged_assets

        JOIN assets
          ON assets.id = damaged_assets.asset_id

        ORDER BY damaged_date DESC
      `,
      )
      .all();

    res.json(damaged);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const markAssetDamaged = (req, res) => {
  try {
    const { assetId, damagedBy, department, damageRemark } = req.body;

    const asset = db
      .prepare(
        `
        SELECT *
        FROM assets
        WHERE id = ?
      `,
      )
      .get(assetId);

    if (!asset) {
      return res.status(404).json({
        error: "Asset not found",
      });
    }

    db.prepare(
      `
      INSERT INTO damaged_assets (
        asset_id,
        damaged_by,
        department,
        damage_remark,
        damaged_date
      )
      VALUES (?, ?, ?, ?, DATE('now'))
    `,
    ).run(assetId, damagedBy, department, damageRemark);

    db.prepare(
      `
      UPDATE assets
      SET status = 'Damaged'
      WHERE id = ?
    `,
    ).run(assetId);

    res.json({
      message: "Asset marked as damaged",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {
  getDamagedAssets,
  markAssetDamaged,
};
