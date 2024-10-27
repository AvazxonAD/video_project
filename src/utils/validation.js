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

const categoryValidation = Joi.object({
    name: Joi.string().trim().required()
})
const categoryQueryValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10)
})

const postValidation = Joi.object({
    title: Joi.string().trim(),
    descr: Joi.string().trim(),
    category_id: Joi.number().min(1)
})
const postQueryValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    category_id: Joi.number().min(1)
})
module.exports = { 
    fileUploadValidation, 
    loginValidation, 
    categoryValidation, 
    categoryQueryValidation, 
    postValidation,
    postQueryValidation
}