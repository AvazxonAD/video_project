const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(cors());
app.use(express.static("./public"));
require('colors')


app.use('/auth', require('./auth/auth.routes'))
app.use('/category', require('./category/category.routes'))
app.use('/post', require('./post/post.routes'))
app.use('/teg', require('./teg/teg.routes'))

app.use(require("./utils/errorHandler"));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.bgBlue);
});