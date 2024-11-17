CREATE TABLE tag_post (
    id BIGSERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES post(id),
    tag_id INTEGER REFERENCES teg(id),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    isdeleted BOOLEAN DEFAULT false
)