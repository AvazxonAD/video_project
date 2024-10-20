const dotenv = require("dotenv");
dotenv.config();
const pool = require('./config/db')
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const upload = require('./utils/protect.file')
const { fileUploadValidation, loginValidation } = require('./utils/validation');
const { generateToken } = require('./utils/generate.token')
const { protect } = require('./auth.js')
const bcrypt = require('bcrypt')
const ErrorResponse = require('./utils/errorResponse.js')
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const PORT = process.env.PORT || 4001;

app.use(express.static("./public"));

app.post('/login', async (req, res, next) => {
    try {
        const { error, value } = loginValidation.validate(req.body)
        if (error) {
            throw new ErrorResponse(error, 404)
        }
        const { login, password } = value
        let user = await pool.query(` SELECT * FROM users WHERE login = $1`, [login]);
        user = user.rows[0]
        if (!user) {
            throw new ErrorResponse('User not found', 404)
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            throw new ErrorResponse("Incorrect login or password", 403)
        }
        const token = generateToken(user);
        delete user.password
        const data = { user, token }
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        return next(new ErrorResponse(err, err.statusCode))
    }
})

app.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new ErrorResponse('ErrorResponse occurred during file upload', 400)
        }
        const user_id = req.user.id
        const { error, value } = fileUploadValidation.validate(req.body)
        if (error) {
            throw new ErrorResponse(error, 400)
        }
        const { title, descr, opesanie } = value;
        const url = 'uploads/' + req.file.filename
        const result = await pool.query(`INSERT INTO videos(title, descr, opesanie, url, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [title, descr, opesanie, url, user_id])
        return res.status(201).json({
            success: true,
            data: result.rows[0]
        })
    } catch (ErrorResponse) {
        return next(new ErrorResponse(err, err.statusCode))
    }
})

app.get('/', protect, async (req, res, next) => {
    try {
        const { rows } = await pool.query(`SELECT id, title, url FROM videos WHERE user_id = $1`, [req.user.id])
        return res.status(200).send({ success: true, data: rows })
    } catch (error) {
        return next(new ErrorResponse(err, err.statusCode))
    }
})

app.get('/:id', protect, async (req, res, next) => {
    try {
        const id = req.params.id
        const { rows } = await pool.query(`SELECT id, title, descr, opesanie, url FROM videos WHERE user_id = $1 AND id = $2`, [req.user.id, id])
        const result = rows[0]
        if (!result) {
            throw new ErrorResponse('not found', 404)
        }
        const filePath = path.join(__dirname, './public/' + result.url)
        if (!fs.existsSync(filePath)) {
            throw new ErrorResponse('File not found', 404);
        }
        const ext = path.extname(result.url);
        const contentType = mime.lookup(ext) || 'application/octet-stream';
        return res.status(200).send({ data: result, contentType});
    } catch (err) {
        return next(new ErrorResponse(err, err.statusCode))
    }
})

app.use(require("./errorHandler.js"));

app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`);
});