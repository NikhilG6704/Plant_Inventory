const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const os = require("os");

const dbFolder = path.join(os.homedir(), "InventoryData");

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

const dbPath = path.join(dbFolder, "inventory.db");

const db = new Database(dbPath);

console.log("Database:", dbPath);

module.exports = db;

///database path(MAC): Users/<username>/InventoryData/inventory.db

///database path(Windows): C:\Users\<username>\InventoryData\inventory.db

///database path(Linux): /home/<username>/InventoryData/inventory.db
