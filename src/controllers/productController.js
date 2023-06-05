const fs = require("fs");
const path = require("path");
const db = require("../database/models");
const { validationResult } = require("express-validator");

module.exports = {
  list: (req, res) => {
       return res.render("products/list");         
  },

  detalle: (req, res) => {
    const { id } = req.params;
    db.Product.findByPk(id, { include: ["images"] })
      .then((product) => {
        const categoryId = product.categoryId;
        db.Product.findAll({
          where: {
            visible: true,
            categoryId: categoryId
          },
          include: ["images"],
          limit: 10
        })
          .then((relatedProducts) => {
            return res.render("products/detalle", { product, relatedProducts });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  },

  creacion: (req, res) => {
    const categories = db.Category.findAll({
      order: [["name"]],
      attributes: ["name", "id"],
    })
      .then((categories) => {
        return res.render("products/creacion", {
          categories,
        });
      })
      .catch((error) => console.log(error));
  },

  create: (req, res) => {
    const errors = validationResult(req); 

    if (!req.files.length && !req.fileValidationError) {
      errors.errors.push({
        value: "",
        msg: "El producto debe tener por lo menos una imagen",
        param: "images",
        location: "files",
      });
    }

    if (req.fileValidationError) {
      errors.errors.push({
        value: "",
        msg: req.fileValidationError,
        param: "images",
        location: "files",
      });
    }

    if (errors.isEmpty()) {
      const { name, image, description, discount, price, category, visible } =
        req.body;
      db.Product.create({
        name: name.trim(),
        price,
        description: description.trim(),
        discount,
        categoryId: category,
        visible: visible,
      })
        .then((product) => {
          req.files.forEach((image) => {
            db.Image.create({
              name: image.filename,
              productId: product.id,
            });
          });

          return res.redirect("/dashboard");
        })
        .catch((error) => console.log(error));
    } else {
      const categories = db.Category.findAll({
        order: [["name"]],
        attributes: ["name", "id"],
      });
      Promise.all([categories])
        .then(([categories]) => {
          return res.render("products/creacion", {
            categories,
            errors: errors.mapped(),
            old: req.body,
          });
        })
        .catch((error) => console.log(error));
    }
  },
  edicion: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await db.Product.findByPk(id, {
        include: ["images", "category"],
      });
      const categories = await db.Category.findAll({
        order: [["name"]],
        attributes: ["name", "id"],
      });
      return res.render("products/edicion", { product, categories });
      return res.json(product);
    } catch (error) {
      console.log(error);
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);


/*     if (req.fileValidationError) {
      errors.errors.push({
       ...req.fileValidationError
      });
    } */
/*     if (!req.files.length && !req.fileValidationError) {
      errors.errors.push({
        value: "",
        msg: "El producto debe tener por lo menos una imagen",
        param: "images",
        location: "files",
      });
    } */

    if (req.fileValidationError) {
      errors.errors.push({
        value: "",
        msg: req.fileValidationError,
        param: "images",
        location: "files",
      });
    }

    if (errors.isEmpty()) {
      try {
        const { name, image, description, discount, price, category, visible } =
          req.body;

        const id = +req.params.id;
        const removeImagesBefore = req.query.removeImageBefore;
        const product = await db.Product.findByPk(id, { include: ["images"] });

        product.name = name.trim();
        product.price = +price;
        product.description = description.trim();
        product.discount = +discount;
        product.categoryId = category;
        product.visible = visible;

        await product.save();

        if (req.files && req.files.length) {
          const images = req.files.map((image) => {
            return {
              name: image.filename,
              productId: id,
            };
          });

          if (removeImagesBefore) {
            product.images.forEach((image) => {
              if (/_products_/.test(image.name)) {
                fs.existsSync(
                  path.join(
                    __dirname,
                    `../../public/images/products/${image.name}`
                  )
                ) &&
                  fs.unlinkSync(
                    path.join(
                      __dirname,
                      `../../public/images/products/${image.name}`
                    )
                  );
              }
            });

            db.Image.destroy({
              where: { productId: id },
            });
          }

          db.Image.bulkCreate(images);
          console.log(images);
        }

        return res.redirect(`/dashboard`);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const id = +req.params.id;
        const product = await db.Product.findByPk(id, {
          include: ["images", "category"],
        });
        const categories = await db.Category.findAll({
          order: [["name"]],
          attributes: ["name", "id"],
        });

        return res.render("products/edicion", {
          product,
          categories,
          errors: errors.mapped(),
          old: req.body,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  remove: async (req, res) => {
    const id = req.params.id;

    try {
      const product = await db.Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      const images = await db.Image.findAll({
        where: { productId: product.id },
      });
      await Promise.all(images.map((image) => image.destroy()));

      product.destroy();

      return res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar el producto" });
    }
  },
};
