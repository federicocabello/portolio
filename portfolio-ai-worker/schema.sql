CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'es')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('answered', 'error')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_history_created_at
    ON chat_history (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_history_session_id
    ON chat_history (session_id);
