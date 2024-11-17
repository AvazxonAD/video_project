const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.functions')

const createPostService = async (data) => {
    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)
        const result = await client.query(`INSERT INTO post(
            title, 
            descr, 
            category_id, 
            user_id, 
            imageurl, 
            created_at, 
            updated_at, 
            content,
            fio
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING * 
        `, [data.title, data.descr, data.category_id, data.user_id, data.imageurl, tashkentTime(), tashkentTime(), data.content, data.fio]);
        data.tags = data.tags.map(item => {
            return { post_id: result.rows[0].id, tag_id: item, created_at: tashkentTime(), updated_at: tashkentTime() };
        });
        const values = data.tags.map((_, index) => `($${4 * index + 1}, $${4 * index + 2}, $${4 * index + 3}, $${4 * index + 4})`);
        const params = data.tags.reduce((acc, obj) => {
            return acc.concat(Object.values(obj));
        }, []);
        const tags = await client.query(
            `INSERT INTO tag_post(post_id, tag_id, created_at, updated_at) VALUES ${values.join(', ')} RETURNING * `, 
            params
        );
        result.rows[0].tags = tags.rows 
        await client.query(`COMMIT`)
        return result.rows[0]
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
}

const getPostService = async (offset, limit, category_id, user_id) => {
    try {
        const params = [offset, limit, user_id]
        let filter = ``
        if (category_id) {
            filter = ` AND category_id = $${params.length + 1}`
            params.push(category_id)
        }
        const result = await pool.query(`
            WITH data AS (SELECT id, title, fio, descr, content, category_id, view, click, imageurl FROM post WHERE isdeleted = false AND user_id = $3 ${filter} ORDER BY created_at OFFSET $1 LIMIT $2)
            SELECT ARRAY_AGG(row_to_json(data)) AS data, (SELECT COALESCE((COUNT(id)), 0)::INTEGER FROM post WHERE isdeleted = false AND user_id = $3 ${filter}) AS total_count
            FROM data
        `, params);
        const data = result.rows[0]
        return { data: data?.data || [], total: data.total_count };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdPostService = async (user_id, id, click = true) => {
    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)
        let result = await client.query(`
            SELECT id, title, fio, descr, content, category_id, view, click, imageurl 
            FROM post 
            WHERE id = $1 AND isdeleted = false AND user_id = $2
        `, [id, user_id]);
        if (!result.rows[0]) {
            throw new ErrorResponse('Post not found', 404)
        }
        if(click){
            await client.query(`UPDATE POST SET click = click + 1 WHERE id = $1`, [id])
        }
        await client.query(`COMMIT`) 
        return result.rows[0];
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
}

const updatePostService = async (data) => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const result = await pool.query(`UPDATE post SET title = $1, descr = $2, category_id = $3, imageurl = $4, updated_at = $5, content = $6, fio = $7 WHERE id = $8 RETURNING *
        `, [data.title, data.descr, data.category_id, data.imageurl, tashkentTime(), data.content, data.fio, data.id]);
        await pool.query(`DELETE FROM tag_post WHERE post_id = $1`, [result.rows[0].id])
        data.tags = data.tags.map(item => {
            return { post_id: result.rows[0].id, tag_id: item, created_at: tashkentTime(), updated_at: tashkentTime() };
        });
        const values = data.tags.map((_, index) => `($${4 * index + 1}, $${4 * index + 2}, $${4 * index + 3}, $${4 * index + 4})`);
        const params = data.tags.reduce((acc, obj) => {
            return acc.concat(Object.values(obj));
        }, []);
        const tags = await client.query(
            `INSERT INTO tag_post(post_id, tag_id, created_at, updated_at) VALUES ${values.join(', ')} RETURNING * `, 
            params
        );
        result.rows[0].tags = tags.rows
        await client.query('COMMIT')
        return result.rows[0]
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
}

const deletePostService = async (id) => {
    try {
        await pool.query(`UPDATE post SET isdeleted = $1 WHERE id = $2`, [true, id]);
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const addViewPostService = async (posts) => {
    const client = await pool.connect(); 
    try {
        await client.query(`BEGIN`);
        const queryArray = [];
        for (let post of posts) {
            const query = client.query(`UPDATE POST SET view = view + 1 WHERE id = $1`, [post.id]); 
            queryArray.push(query);
        }
        await Promise.all(queryArray);
        await client.query(`COMMIT`); 
    } catch (error) {
        await client.query(`ROLLBACK`); 
        throw new ErrorResponse(error, error?.statusCode); 
    } finally {
        client.release();
    }
};


module.exports = {
    createPostService,
    getPostService,
    getByIdPostService,
    updatePostService,
    deletePostService,
    addViewPostService
};
