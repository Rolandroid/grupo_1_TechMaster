const fs = require("fs");
const path = require("path");
const db = require("../../database/models");
const {
  findAllProducts,
  findByPkPProducts,
  updateProductById,
  createProduct,
  destroyProductById,
} = require("../../services/productServices");
module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const products = await findAllProducts(req, res);
  
      let respuesta = {
        meta: {
          status: 200,
          url: `http://localhost:3000/api/products/`,
          totalProducts: products.length,
        },
        data: {
          products
        }
      };
  
      res.json(respuesta);
      console.log(products);
    } catch (error) {
      console.log(error);
    }
  },
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // obtener la página actual del query string
      const limit = parseInt(req.query.limit) || 4; // obtener el límite de registros por página del query string
      const offset = (page - 1) * limit; // calcular el offset a partir de la página actual y el límite de registros por página

      const products = await db.Product.findAndCountAll({
        // incluir count para saber la cantidad total de productos
        include: ["category","images"],
        limit,
        offset,
        order: [["createdAt", "DESC"]], // ordenar por fecha de creación
      });

      const totalPages = Math.ceil(products.count / limit); // calcular la cantidad total de páginas
      const categories = await db.Category.findAll({ include: ["products"] });

      const countByCategory = categories.reduce((obj, category) => {
        obj[category.name] = category.products.length;
        return obj;
      }, {});

      const detalleProducto = products.rows.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category.name,
        detailUrl: `http://localhost:3000/api/products/${product.id}`,
      }));

      const respuesta = {
        meta: {
          status: 200,
          total: products.count,
          totalPages, // agregar la cantidad total de páginas a la respuesta
          currentPage: page, // agregar la página actual a la respuesta
          countByCategory,

          url: "api/products",
          products: detalleProducto,
        },
      };

      res.json(respuesta);
    } catch (error) {
      res.json(error);
    }
  },
  listWithPaginate: async (req, res) => {
    try {
      const { page = 1, limit = 6 } = req.query;

      let options = {
        include: [
          {
            association: "images",
          },
          {
            association: "category",
          },
        ],
        page: +page,
        paginate: +limit,
      };

      const { docs: data, pages } = await db.Product.paginate(options);

      return res.status(200).json({
        ok: true,
        data,
        pages,
        currentPage: page,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        ok: false,
        error: {
          status: error.status || 500,
          message: error.message || "Upss, hubo un error",
        },
      });
    }
  },
  detail: async (req, res) => {
    try {
    const product = await findByPkPProducts(req, res);
      const arrayImages = product.images.map((image) => {
        return `/Images/products/${image.name}`;
      });
      let respuesta = {
        meta: {
          status: 200,
          url: `http://localhost:3000/api/products/${product.id}`,
          arrayImages
        },
        data: product,
      };
      res.json(respuesta);
    } catch (error) {
      console.log(error);
    }
  },
  /* Para la funcion create, se espera por body: name, price, description, discount, categoryId, visible e images, donde images es un array de hasta 3 imagenes. */
  create: async (req, res) => {
    try {
      const { name, price, description, discount, categoryId, visible } =
        req.body;

      const product = await db.Product.create({
        name: name.trim(),
        price,
        description: description.trim(),
        discount,
        categoryId: categoryId,
        visible: visible,
      });

      req.files.forEach(async (image) => {
        await db.Image.create({
          name: image.filename,
          productId: product.id,
        });
      });
      var finalProduct = {
        status: 201,
        url: "http://localhost:3000/api/products/",
        productData: {
          id: product.id,
          name: product.dataValues.name,
          price: +product.dataValues.price,
          discount: +product.dataValues.discount,
          finalPrice:
            product.dataValues.price -
            (product.dataValues.discount / 100) * product.dataValues.price,
          description: product.dataValues.description,
          categoryId: product.dataValues.categoryId,
          images: req.files.map((file, index) => {
            return (images = {
              position: index,
              filename: file.filename,
              location: `http://localhost:3000/Images/products/${file.filename}`,
            });
          }),
        },
      };

      console.log(finalProduct);
      return res.json({ finalProduct });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  update: async (req, res) => {
    const id = +req.params.id;
    const removeImagesBefore = true;
    const { name, description, discount, price, categoryId, visible } =
      req.body;
    try {
      const product = await db.Product.findByPk(id, { include: ["images"] });

      product.name = name.trim();
      product.price = +price;
      product.description = description.trim();
      product.discount = +discount;
      product.categoryId = categoryId;
      product.visible = visible;

      await product.save();

      if (req.files) {
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
                  `../../../public/images/products/${image.name}`
                )
              ) &&
                fs.unlinkSync(
                  path.join(
                    __dirname,
                    `../../../public/images/products/${image.name}`
                  )
                );
            }
          });

          db.Image.destroy({
            where: { productId: id },
          });
        }

        db.Image.bulkCreate(images);
      }

      return res.status(201).json({
        Details: "http://localhost:3000/api/products/" + id,
      });
    } catch (error) {
      console.log(error);
    }
  },
  remove: async (req, res) => {
    const id = +req.params.id;
    try {
      await db.Image.destroy({ where: { productId: id } });
      await db.Product.destroy({ where: { id: id } });
      return res.status(200).json({ message: "Elimination successful" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
