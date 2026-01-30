-- CEMA Application D1 Database Schema
-- Created for Cloudflare D1 Database

-- Users table for authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations table
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    student_rut TEXT NOT NULL,
    course TEXT NOT NULL,
    evaluation_date DATE NOT NULL,
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

-- Insert default admin user (password: admin123 - change in production)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@piwisuite.cl', 'ADMIN_PASSWORD_HASH_PLACEHOLDER', 'Administrador', 'admin');

-- Insert default admin user (password: user123 - change in production)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('user@piwisuite.cl', 'USER_PASSWORD_HASH_PLACEHOLDER', 'Usuario', 'user');
