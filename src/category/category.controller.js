const {
  getByNameCategoryService,
  createCategoryService,
  getCategoryService,
  getByIdCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require("./category.service");
const { categoryValidation, categoryQueryValidation } = require("../utils/validation");;
const { validationResponse } = require("../utils/validation.response");
const { resFunc } = require("../utils/res.func");
const { errorCatch } = require("../utils/error.catch");

// createCategory
const createCategory = async (req, res) => {
  try {
    const user_id = req.user.id
    const { name } = validationResponse(categoryValidation, req.body)
    await getByNameCategoryService(name, user_id);
    const result = await createCategoryService(name, user_id);
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getCategory = async (req, res) => {
  try {
    const user_id = req.user.id
    const { page, limit } = validationResponse(categoryQueryValidation, req.query)
    const offset = (page - 1) * limit
    const {data, total} = await getCategoryService(user_id, offset, limit);
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

// updateCategory
const updateCategory = async (req, res) => {
  try {
    const user_id = req.user.id
    const id = req.params.id;
    const oldCategory = await getByIdCategoryService(user_id, req.params.id);
    const { name } = validationResponse(categoryValidation, req.body)
    if (oldCategory.name !== name) {
      await getByNameCategoryService(name, user_id);
    }
    const result = await updateCategoryService(name, id);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete category 
const deleteCategory = async (req, res) => {
  try {
    const user_id = req.user.id
    const id = req.params.id;
    await getByIdCategoryService(user_id, id);
    await deleteCategoryService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdCategory = async (req, res) => {
  try {
    const user_id = req.user.id
    const result = await getByIdCategoryService(user_id, req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getByIdCategory,
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
