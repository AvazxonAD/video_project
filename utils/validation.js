const Joi = require('joi')

const fileUploadValidation = Joi.object({
    title: Joi.string().trim().required(),
    descr: Joi.string().trim().required(),
    opesanie: Joi.string().trim().required()
})

const loginValidation = Joi.object({
    login: Joi.string().trim().required(),
    password: Joi.string().trim().required()
})

module.exports = { fileUploadValidation, loginValidation }