const { verifyUser } = require("../../config/passport.config");
const {
  addProducts,
  getAllProducts,
} = require("../../services/product.services");

class productController {
  async getProducts(req, res, next) {
    try {
      const products = getAllProducts(req);

      if (products) {
        return res.json({ message: "Something went wrong" });
      } else {
        return res.status(500).json(products);
      }
    } catch (error) {
      next(error);
    }
  }

  async addTheProduct(req, res, next) {
    try {
      await verifyUser(req, res, () => {});

      // Check if the user is authenticated (verified)
      if (!req.user) {
        res.header(`Content-Type`, `application/json`);
        res.status(401)
        res.json({ message: "Unauthorized. Please login." });
        return res;
      }

      req.body.User = req.user._id;
      console.log(req.user);

      const addproduct = addProducts(req);

      if (addproduct) {
        res.header(`Content-Type`, `application/json`);
        res.status(200).json({ message: "Unsuccessfull" });
        return res;
      } else {
        return res.status(200).json(addproduct);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new productController();
