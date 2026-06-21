CREATE TABLE IF NOT EXISTS pr_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pr_no TEXT UNIQUE NOT NULL,
    po_no TEXT,
    total_items INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    pr_id INTEGER NOT NULL,

    item_name TEXT NOT NULL,
    item_code TEXT NOT NULL,
    description TEXT,

    serial_number TEXT UNIQUE NOT NULL,

    is_ilms INTEGER DEFAULT 0,

    date_added DATE,

    status TEXT DEFAULT 'Available',

    issue_date DATE,
    return_date DATE,
    damaged_date DATE,

    department TEXT,

    remarks TEXT,

    FOREIGN KEY(pr_id)
    REFERENCES pr_master(id)
);

CREATE TABLE IF NOT EXISTS issue_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    issued_to TEXT NOT NULL,

    department TEXT NOT NULL,

    issue_date DATE NOT NULL,

    actual_return_date DATE,

    issue_remark TEXT,

    return_remark TEXT,

    status TEXT DEFAULT 'Issued',

    FOREIGN KEY(asset_id)
    REFERENCES assets(id)
);

CREATE TABLE IF NOT EXISTS damaged_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    damaged_date DATE DEFAULT CURRENT_DATE,

    damaged_by TEXT,
    department TEXT,

    damage_remark TEXT,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id)
);