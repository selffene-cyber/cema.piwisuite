-- CEMA Application D1 Database Schema
-- Created for Cloudflare D1 Database

-- Drop existing tables (for clean re-creation)
DROP TABLE IF EXISTS evaluation_criteria;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS users;

-- Users table for authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    telefono TEXT,
    cargo TEXT,
    role TEXT DEFAULT 'user',
    estado TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations table
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Original CEMA student fields (kept for compatibility)
    student_name TEXT,
    student_rut TEXT,
    course TEXT,
    evaluation_date DATE,
    -- CEMA belt analysis fields
    tag TEXT,
    faena TEXT,
    tipo_correa TEXT,
    tipo_correa_valor TEXT,
    capacidad_valor REAL,
    capacidad TEXT,
    tipo_material TEXT,
    belt_width_value REAL,
    belt_width_unit TEXT,
    belt_speed_value REAL,
    belt_speed_unit TEXT,
    splice_type TEXT,
    abrasiveness TEXT,
    moisture TEXT,
    severity_class INTEGER DEFAULT 0,
    -- Common fields
    evaluator_id INTEGER,
    total_score REAL DEFAULT 0,
    max_score REAL DEFAULT 100,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluator_id) REFERENCES users(id)
);

-- Evaluation criteria table
CREATE TABLE evaluation_criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluation_id INTEGER NOT NULL,
    criterion_name TEXT NOT NULL,
    score REAL NOT NULL,
    max_score REAL DEFAULT 10,
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
);

-- Files table for R2 storage references
CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    r2_key TEXT UNIQUE NOT NULL,
    r2_bucket TEXT DEFAULT 'cema-files',
    uploaded_by INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Audit log table
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    table_affected TEXT,
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_evaluations_student ON evaluations(student_rut);
CREATE INDEX idx_evaluations_evaluator ON evaluations(evaluator_id);
CREATE INDEX idx_evaluations_date ON evaluations(evaluation_date);
CREATE INDEX idx_files_r2_key ON files(r2_key);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Insert default admin user (password: cema2026)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('cema@cema.cl', '6104cc944c4efa50fd18e2b1bc4954dbf02e3dfbc5c3aad544f6f2d05215a1eb', 'Administrador CEMA', 'admin');

-- Insert demo user (password: user123)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('user@piwisuite.cl', 'USER_PASSWORD_HASH_PLACEHOLDER', 'Usuario Demo', 'user');
