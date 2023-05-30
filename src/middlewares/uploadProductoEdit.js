const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storageProductImages = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/images/products");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      `${Date.now()}_products_${path.extname(file.originalname)}`
    );
  },
});

const configUploadProductImages = multer({
  storage: storageProductImages,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      req.fileValidationError = "Los archivos deben ser imágenes";
      return cb(new Error(req.fileValidationError), false);
    }
    cb(null, true);
  },
  limits: {
    files: 3,
  },
  abortEarly: true, // Agregar la opción abortEarly para evitar que se guarden las imágenes si hay errores
});

const uploadProductImagesEdit = (req, res, next) => {
  const upload = configUploadProductImages.array("images");

  upload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      req.fileValidationError = "Debes ingresar 3 imágenes";
    } else if (!req.files?.length) {
    } else if (req.files.length !== 3) {
      req.fileValidationError = "Debes ingresar 3 imágenes";
      console.log(req.files);
     
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          }
        });
      });
      delete req.files;
    }

    return next();
  });
};


module.exports = {
  uploadProductImagesEdit,
};

