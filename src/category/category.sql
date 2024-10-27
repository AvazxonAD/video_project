CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    isdeleted BOOLEAN DEFAULT false
)