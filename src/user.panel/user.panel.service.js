const pool = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');

const getPostService = async (offset, limit, category_id, search) => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const params = [offset, limit]
        let filter = ``
        let search_filter = ``
        if (category_id) {
            filter = ` AND p.category_id = $${params.length + 1}`
            params.push(category_id)
        }
        if (search) {
            search_filter = `AND p.title ILIKE '%' || $${params.length + 1} || '%'`
            params.push(search)
        }
        const result = await client.query(`--sql
            WITH data AS 
                (
                    SELECT 
                        p.id, 
                        p.title, 
                        p.fio, 
                        p.descr, 
                        p.content, 
                        p.category_id, 
                        c.name AS category_name,
                        p.view, 
                        p.click, 
                        p.imageurl, 
                        (
                            SELECT JSONB_AGG(JSON_BUILD_OBJECT('id', t.id, 'teg', t.teg))
                            FROM tag_post pt
                            JOIN teg t ON t.id = pt.tag_id
                            WHERE pt.post_id = p.id
                        ) AS tags
                    FROM post AS p 
                    JOIN category AS c ON c.id = p.category_id
                    WHERE p.isdeleted = false ${filter} ${search_filter}
                    ORDER BY p.created_at OFFSET $1 LIMIT $2
                )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data, 
                (SELECT COALESCE((COUNT(id)), 0)::INTEGER FROM post AS p WHERE p.isdeleted = false ${filter} ${search_filter}) AS total_count
            FROM data
        `, params);
        const data = result.rows[0].data
        if (data.length > 1) {
            await client.query(`
                UPDATE post 
                SET view = view + 1 
                WHERE id >= $1 AND id <= $2 AND isdeleted = false
            `, [data[0].id, data[data.length - 1].id]);
        } else if (data.length === 1) {
            await client.query(`--sql
                UPDATE post SET view = view + 1 WHERE id = $1 AND isdeleted = false  
            `, [data[0].id])
        }
        await client.query(`COMMIT`)
        return { data: data || [], total: result.rows[0].total_count };
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
}

const getByIdPostService = async (id) => {
    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)
        let result = await client.query(`--sql
            SELECT 
                p.id, 
                p.title, 
                p.fio, 
                p.descr, 
                p.content, 
                p.category_id, 
                c.name AS category_name,
                p.view, 
                p.click, 
                p.imageurl, 
                (
                    SELECT JSONB_AGG(JSON_BUILD_OBJECT('id', t.id, 'teg', t.teg))
                    FROM tag_post pt
                    JOIN teg t ON t.id = pt.tag_id
                    WHERE pt.post_id = p.id
                ) AS tags
            FROM post AS p  
            JOIN category AS c ON c.id = p.category_id
            WHERE p.id = $1 AND p.isdeleted = false
        `, [id]);
        if (!result.rows[0]) {
            throw new ErrorResponse('Post not found', 404)
        }
        await client.query(`UPDATE POST SET click = click + 1 WHERE id = $1`, [id])
        await client.query(`COMMIT`)
        return result.rows[0];
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
}

module.exports = {
    getPostService,
    getByIdPostService
}