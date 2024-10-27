const { validationResponse } = require('../utils/validation.response')
const { loginValidation } = require('../utils/validation')
const { errorCatch } = require('../utils/error.catch')
const { getByLoginUserService } = require('./auth.service')
const { resFunc } = require('../utils/res.func')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generate.token')

const login = async (req, res) => {
    try {
        const { login, password } = validationResponse(loginValidation, req.body)
        const user = await getByLoginUserService(login)
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            throw new ErrorResponse("Incorrect login or password", 403)
        }
        const token = generateToken(user);
        delete user.password
        const data = { user, token }
        return resFunc(res, 200, data)
    } catch (err) {
        errorCatch(err, res)
    }
}

module.exports = {
    login
}