const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/jpeg|image\/jpg|image\/png|image\/gif|video\/mp4|video\/x-msvideo|video\/x-matroska/.test(
      file.mimetype,
    );
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image and video files are allowed.'));
    }
  }

module.exports = upload;