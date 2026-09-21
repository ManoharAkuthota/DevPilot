-- =========================================================
-- DevPilot – TiDB / MySQL Production Schema & Seed
-- Compatible with TiDB Serverless & MySQL 8.0
-- =========================================================

CREATE DATABASE IF NOT EXISTS devpilot_db;
USE devpilot_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    bio VARCHAR(1000),
    avatar_url VARCHAR(255),
    tech_stack VARCHAR(1000),
    skills VARCHAR(2000),
    portfolio_url VARCHAR(255),
    github_username VARCHAR(255),
    productivity_score INT DEFAULT 88,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(128) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. GitHub Profiles Table
CREATE TABLE IF NOT EXISTS github_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    bio VARCHAR(1000),
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    contributions_count INT DEFAULT 0,
    languages_json TEXT,
    commit_activity_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Repositories Table
CREATE TABLE IF NOT EXISTS repositories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    description VARCHAR(2000),
    html_url VARCHAR(255),
    language VARCHAR(100),
    stars_count INT DEFAULT 0,
    forks_count INT DEFAULT 0,
    open_issues_count INT DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    ai_summary TEXT,
    repo_updated_at DATETIME,
    FOREIGN KEY (profile_id) REFERENCES github_profiles(id) ON DELETE CASCADE
);

-- 5. Tasks (Kanban) Table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    position_index INT DEFAULT 0,
    due_date DATE,
    labels VARCHAR(500),
    estimated_hours DOUBLE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Task Comments Table
CREATE TABLE IF NOT EXISTS task_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar VARCHAR(255),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 7. AI Chats Table
CREATE TABLE IF NOT EXISTS ai_chats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category_template VARCHAR(50) DEFAULT 'GENERAL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. AI Messages Table
CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    code_language VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES ai_chats(id) ON DELETE CASCADE
);

-- 9. Automations Table
CREATE TABLE IF NOT EXISTS automations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    target_url VARCHAR(500) NOT NULL,
    action_type VARCHAR(50) NOT NULL DEFAULT 'SCREENSHOT_CAPTURE',
    actions_json TEXT,
    schedule_cron VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Automation Runs Table
CREATE TABLE IF NOT EXISTS automation_runs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    automation_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    screenshot_url VARCHAR(500),
    captured_title VARCHAR(300),
    logs TEXT,
    duration_ms BIGINT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (automation_id) REFERENCES automations(id) ON DELETE CASCADE
);

-- 11. System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cpu_usage_pct DOUBLE,
    memory_used_mb BIGINT,
    memory_total_mb BIGINT,
    memory_usage_pct DOUBLE,
    disk_used_gb DOUBLE,
    disk_total_gb DOUBLE,
    active_threads INT,
    uptime_seconds BIGINT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
