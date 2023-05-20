const multer = require("multer");
const path = require("path");
const fs = require("fs")

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
  limits: {
    files: 3,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      req.fileValidationError = "Los archivos deben ser imágenes";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});

const uploadProductImagesEdit = (req, res, next) => {
  const upload = configUploadProductImages.array("images");

  upload(req, res, function (error) {
 if (req.files.length !== 3) {
      req.fileValidationError = "Debes ingresar tres imágenes ";
    }
    if (req.fileValidationError) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
 /*    console.log(req.fileValidationErro); */
    next();
  });
};




module.exports = {
  uploadProductImagesEdit,
};
