// services/product.services.js

const ProductModel = require("../model/ProductModel");

class ProductServices {
  async getAllProducts(req, res, next) {
    try {
      // Call the logoutUser function from the AuthService
      const getProduct = await ProductModel.find();

      return getProduct;
    } catch (error) {
      next(error);
    }
  }
  async addProducts(req, res, next) {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    return newProduct;
  }
}

module.exports = new ProductServices();
