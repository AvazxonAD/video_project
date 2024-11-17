CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    image VARCHAR(1000) NOT NUll,
    user_id INTEGER REFERENCES users(id),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    isdeleted BOOLEAN DEFAULT false
)