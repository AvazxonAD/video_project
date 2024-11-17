const {
    createPostService,
    getPostService,
    getByIdPostService,
    updatePostService,
    deletePostService,
    addViewPostService
} = require("./post.service");
const { postQueryValidation, postValidation } = require("../utils/validation");;
const { validationResponse } = require("../utils/validation.response");
const { resFunc } = require("../utils/res.func");
const { errorCatch } = require("../utils/error.catch");
const path = require('path')
const fs = require('fs')
const { getByIdCategoryService } = require('../category/category.service')
const { getByIdtegService } = require('../teg/teg.service')
const ErrorResponse = require('../utils/errorResponse')


// createPost
const createPost = async (req, res) => {
    try {
        if(!req.file){
            throw new ErrorResponse('file not found', 404)
        }
        const user_id = req.user.id
        const data = validationResponse(postValidation, req.body)
        await getByIdCategoryService(user_id, data.category_id)
        const tag_array = data.tags.split(',')
        for (let tag of tag_array) {
            await getByIdtegService(user_id, tag)
        }
        data.tags = tag_array
        const url = '/uploads/' + req.file.filename
        const result = await createPostService({ ...data, user_id, imageurl: url });
        resFunc(res, 201, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get all
const getPost = async (req, res) => {
    try {
        const user_id = req.user.id
        const { page, limit, category_id } = validationResponse(postQueryValidation, req.query)
        const offset = (page - 1) * limit
        const { data, total } = await getPostService(offset, limit, category_id, user_id);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
        }
        await addViewPostService(data)
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

// updatePost
const updatePost = async (req, res) => {
    try {
        const user_id = req.user.id
        const id = req.params.id
        const old_data = await getByIdPostService(user_id, id, false)
        const data = validationResponse(postValidation, req.body)
        await getByIdCategoryService(user_id, data.category_id)
        const filePath = path.join(__dirname, `../../public/${old_data.imageurl}`)
        const tag_array = data.tags.split(',')
        for (let tag of tag_array) {
            await getByIdtegService(user_id, tag)
        }
        data.tags = tag_array
        const url = '/uploads/' + req.file.filename
        const result = await updatePostService({ ...data, user_id, imageurl: url, id });
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
        resFunc(res, 201, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

// delete category 
const deletePost = async (req, res) => {
    try {
        const user_id = req.user.id
        const id = req.params.id;
        await getByIdPostService(user_id, id, false);
        await deletePostService(id);
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

// get element by id
const getByIdPost = async (req, res) => {
    try {
        const id = req.params.id 
        const user_id = req.user.id
        const result = await getByIdPostService(user_id, id, false);
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getByIdPost,
    createPost,
    getPost,
    deletePost,
    updatePost,
};
