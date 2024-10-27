const resFunc = (res, status, data, meta) => {
    return res.status(status).send({
        success: true,
        meta: meta,
        data: data
    })
}

module.exports = {
    resFunc
}