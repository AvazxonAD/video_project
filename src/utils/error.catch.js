const errorCatch = (error, res) => {
    console.log(error.stack.red);
    return res.status(error?.statusCode || 500).send({
        error: error.message || "internal server error"
    });
}

module.exports = { errorCatch }