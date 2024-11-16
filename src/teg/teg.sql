CREATE TABLE teg (
    id SERIAL PRIMARY KEY,
    teg VARCHAR NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    isdeleted BOOLEAN DEFAULT false
)