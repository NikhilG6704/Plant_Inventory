const db = require("../database/db");

/* =========================
   ISSUE ASSET
========================= */

const issueAsset = (req, res) => {
  try {
    const { assetId, issuedTo, department, remark } = req.body;

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

    if (asset.status === "Issued") {
      return res.status(400).json({
        error: "Asset is already issued",
      });
    }

    db.prepare(
      `
      INSERT INTO issue_history (
        asset_id,
        issued_to,
        department,
        issue_date,
        issue_remark,
        status
      )
      VALUES (?, ?, ?, DATE('now'), ?, 'Issued')
    `,
    ).run(assetId, issuedTo, department, remark);

    db.prepare(
      `
      UPDATE assets
      SET
        status = 'Issued',
        issue_date = DATE('now'),
        department = ?,
        remarks = ?
      WHERE id = ?
    `,
    ).run(department, remark, assetId);

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
        status = 'Available',
        return_date = DATE('now')
      WHERE id = ?
    `,
    ).run(issue.asset_id);

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
