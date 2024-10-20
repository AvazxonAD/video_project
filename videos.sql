CREATE TABLE videos(
    id SERIAL PRIMARY KEY,
    title VARCHAR, 
    descr VARCHAR, 
    opesanie VARCHAR, 
    url VARCHAR, 
    user_id INTEGER REFERENCES users(id)
)