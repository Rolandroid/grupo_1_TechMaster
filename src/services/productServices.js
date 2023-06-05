const db = require('../database/models');

const findAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: ["category", "images"],
    });
    return products
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const findByPkPProducts = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await db.Product.findByPk(productId, {
      include: ["category", "images"],
    });
    if (product) {
      return product;
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

const updateProductById = async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;
  try {
    const product = await db.Product.findByPk(productId);
    if (product) {
      await product.update(updatedProductData);
      res.json({ message: 'Producto actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const createProduct = async (req, res) => {
  const newProductData = req.body;
  try {
    const newProduct = await db.Product.create(newProductData);
    res.json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

const destroyProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await db.Product.findByPk(productId);
    if (product) {
      await product.destroy();
      res.json({ message: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  findAllProducts,
  findByPkPProducts,
  updateProductById,
  createProduct,
  destroyProductById,
};