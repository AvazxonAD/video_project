const {
    getPostService,
    getByIdPostService
} = require("./user.panel.service");
const { postQueryValidation } = require("../utils/validation");;
const { validationResponse } = require("../utils/validation.response");
const { resFunc } = require("../utils/res.func");
const { errorCatch } = require("../utils/error.catch");
const { getByIdCategoryService } = require('../category/category.service')

// get all
const getPost = async (req, res) => {
    try {
        const { page, limit, category_id, search } = validationResponse(postQueryValidation, req.query)
        const offset = (page - 1) * limit;
        const { data, total } = await getPostService(offset, limit, category_id, search);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
        }
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get element by id
const getByIdPost = async (req, res) => {
    try {
        const id = req.params.id 
        const result = await getByIdPostService(id, false);
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getByIdPost,
    getPost
};
