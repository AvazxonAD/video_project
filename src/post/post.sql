CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    descr VARCHAR(10000),
    category_id INTEGER REFERENCES category(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    imageUrl VARCHAR(1000),
    view INTEGER DEFAULT 0,
    click INTEGER DEFAULT 0,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);
