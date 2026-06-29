const db = require("../database/db");

/* =========================
   ISSUE ASSET
========================= */

const issueAsset = (req, res) => {
  try {
    const { assetId, issuedTo, department, remark, quantity } = req.body;

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

    const issueQty = Number(quantity);

    if (!issueQty || issueQty < 1) {
      return res.status(400).json({
        error: "Invalid quantity",
      });
    }

    if (asset.available_quantity < issueQty) {
      return res.status(400).json({
        error: `Only ${asset.available_quantity} available`,
      });
    }

    db.prepare(
      `
      INSERT INTO issue_history (
        asset_id,
        issued_to,
        department,
        issued_quantity,
        issue_date,
        issue_remark,
        status
      )
      VALUES (?, ?, ?, ?, DATE('now'), ?, 'Issued')
    `,
    ).run(assetId, issuedTo, department, issueQty, remark);

    db.prepare(
      `
      UPDATE assets
      SET
        available_quantity = available_quantity - ?,
        issued_quantity = issued_quantity + ?,
        issue_date = DATE('now'),
        department = ?,
        remarks = ?,
        status =
          CASE
            WHEN (available_quantity - ?) = 0
            THEN 'Issued'
            ELSE 'Available'
          END
      WHERE id = ?
    `,
    ).run(issueQty, issueQty, department, remark, issueQty, assetId);

    res.status(201).json({
      message: "Asset issued successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* =========================
   CURRENTLY ISSUED ASSETS
========================= */

const getIssuedAssets = (req, res) => {
  try {
    const issues = db
      .prepare(
        `
        SELECT
          issue_history.id,
          issue_history.asset_id,
          issue_history.issued_to,
          issue_history.department,
          issue_history.issued_quantity,
          issue_history.issue_date,
          issue_history.issue_remark,
          issue_history.status,

          assets.item_name,
          assets.item_code,
          assets.serial_number,
          assets.pr_id

        FROM issue_history

        JOIN assets
          ON assets.id = issue_history.asset_id

        WHERE issue_history.status = 'Issued'

        ORDER BY issue_history.issue_date DESC
      `,
      )
      .all();

    res.json(issues);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* =========================
   RETURNED ASSETS HISTORY
========================= */

const getReturnedAssets = (req, res) => {
  try {
    const assets = db
      .prepare(
        `
        SELECT
          issue_history.id,
          issue_history.asset_id,
          issue_history.issued_to,
          issue_history.department,
          issue_history.issued_quantity,
          issue_history.issue_date,
          issue_history.actual_return_date,
          issue_history.issue_remark,
          issue_history.return_remark,
          issue_history.status,

          assets.item_name,
          assets.item_code,
          assets.serial_number,
          assets.pr_id

        FROM issue_history

        JOIN assets
          ON assets.id = issue_history.asset_id

        WHERE issue_history.status = 'Returned'

        ORDER BY issue_history.actual_return_date DESC
      `,
      )
      .all();

    res.json(assets);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* =========================
   RETURN ASSET
========================= */

const returnAsset = (req, res) => {
  try {
    const issueId = req.params.id;

    const issue = db
      .prepare(
        `
        SELECT *
        FROM issue_history
        WHERE id = ?
      `,
      )
      .get(issueId);

    if (!issue) {
      return res.status(404).json({
        error: "Issue record not found",
      });
    }

    db.prepare(
      `
      UPDATE issue_history
      SET
        actual_return_date = DATE('now'),
        status = 'Returned'
      WHERE id = ?
    `,
    ).run(issueId);

    db.prepare(
      `
      UPDATE assets
      SET
        available_quantity = available_quantity + ?,
        issued_quantity = issued_quantity - ?,
        return_date = DATE('now'),
        status =
          CASE
            WHEN (issued_quantity - ?) <= 0
            THEN 'Available'
            ELSE 'Issued'
          END
      WHERE id = ?
    `,
    ).run(
      issue.issued_quantity,
      issue.issued_quantity,
      issue.issued_quantity,
      issue.asset_id,
    );

    res.json({
      message: "Asset returned successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  issueAsset,
  getIssuedAssets,
  getReturnedAssets,
  returnAsset,
};
