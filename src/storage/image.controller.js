const {
  createimageService,
  getimageService,
  getByIdimageService,
  updateimageService,
  deleteimageService,
} = require("./image.service");
const { imageQueryValidation } = require("../utils/validation");;
const { validationResponse } = require("../utils/validation.response");
const { resFunc } = require("../utils/res.func");
const { errorCatch } = require("../utils/error.catch");
const ErrorResponse = require('../utils/errorResponse')
const path = require('path')
const fs = require('fs')

// createimage
const createimage = async (req, res) => {
  try {
    if (!req.file) {
      throw new ErrorResponse('file not found', 400)
    }
    const user_id = req.user.id;
    const url = '/uploads/' + req.file.filename;
    const result = await createimageService(url, user_id);
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getimage = async (req, res) => {
  try {
    const user_id = req.user.id
    const { page, limit } = validationResponse(imageQueryValidation, req.query)
    const offset = (page - 1) * limit
    const { data, total } = await getimageService(user_id, offset, limit);
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

// updateimage
const updateimage = async (req, res) => {
  try {
    if(!req.file){
      throw new ErrorResponse('file not found', 404)
    }
    const user_id = req.user.id
    const id = req.params.id;
    const oldimage = await getByIdimageService(user_id, req.params.id);
    const filePath = path.join(__dirname, `../../public/${oldimage.image}`)
    const url = '/uploads/' + req.file.filename;
    const result = await updateimageService(url, id);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete image 
const deleteimage = async (req, res) => {
  try {
    const user_id = req.user.id
    const id = req.params.id;
    await getByIdimageService(user_id, id);
    await deleteimageService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdimage = async (req, res) => {
  try {
    const user_id = req.user.id
    const result = await getByIdimageService(user_id, req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getByIdimage,
  createimage,
  getimage,
  deleteimage,
  updateimage,
};
