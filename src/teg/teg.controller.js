const {
  getBytegtegService,
  createtegService,
  gettegService,
  getByIdtegService,
  updatetegService,
  deletetegService,
} = require("./teg.service");
const { tegValidation, tegQueryValidation } = require("../utils/validation");;
const { validationResponse } = require("../utils/validation.response");
const { resFunc } = require("../utils/res.func");
const { errorCatch } = require("../utils/error.catch");

// createteg
const createteg = async (req, res) => {
  try {
    const user_id = req.user.id
    const { teg } = validationResponse(tegValidation, req.body)
    await getBytegtegService(teg, user_id);
    const result = await createtegService(teg, user_id);
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getteg = async (req, res) => {
  try {
    const user_id = req.user.id
    const { page, limit } = validationResponse(tegQueryValidation, req.query)
    const offset = (page - 1) * limit
    const {data, total} = await gettegService(user_id, offset, limit);
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

// updateteg
const updateteg = async (req, res) => {
  try {
    const user_id = req.user.id
    const id = req.params.id;
    const oldteg = await getByIdtegService(user_id, req.params.id);
    const { teg } = validationResponse(tegValidation, req.body)
    if (oldteg.teg !== teg) {
      await getBytegtegService(teg, user_id);
    }
    const result = await updatetegService(teg, id);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete teg 
const deleteteg = async (req, res) => {
  try {
    const user_id = req.user.id
    const id = req.params.id;
    await getByIdtegService(user_id, id);
    await deletetegService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdteg = async (req, res) => {
  try {
    const user_id = req.user.id
    const result = await getByIdtegService(user_id, req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getByIdteg,
  createteg,
  getteg,
  deleteteg,
  updateteg,
};
