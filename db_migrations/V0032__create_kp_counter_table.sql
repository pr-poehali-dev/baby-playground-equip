CREATE TABLE IF NOT EXISTS kp_counter (
    id INTEGER PRIMARY KEY DEFAULT 1,
    year INTEGER NOT NULL,
    counter INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Вставляем начальную запись
INSERT INTO kp_counter (id, year, counter) 
VALUES (1, 2026, 0)
ON CONFLICT (id) DO NOTHING;