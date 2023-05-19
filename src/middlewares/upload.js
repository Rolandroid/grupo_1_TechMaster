const multer = require("multer");
const path = require("path");

const storageProductImages = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/images/products");
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}_products_${path.extname(file.originalname)}`);
  },
});

const configUploadProductImages = multer({
  storage: storageProductImages,
  limit: {
    files: 3,
  },
  fileFilter: (req, file, cb) => {
    let existError = false;
    const param = { param: "images" };
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      existError = true;
      req.fileValidationError = {
        msg: "Los archivos deben ser imágenes",
        ...param,
      };
    } else if (req.files.length !== 3) {
      req.fileValidationError = {
        msg: "Debes ingresar tres imágenes",
        ...param,
      };
      existError = true;
    }
    if (existError) {
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});

const uploadProductImages = (req, res, next) => {
  const upload = configUploadProductImages.array("images");
  
  if (!req.files?.length || !req.files) {
    req.fileValidationError = {
      msg: "Las imágenes son requeridas",
      param: "images",
    };
  } 
  upload(req, res, function (error) {
    next();
  });
};

module.exports = {
  uploadProductImages,
};
