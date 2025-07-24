const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router
  .route('/')
  .get(getProducts)
  .post(authorize('owner', 'admin'), createProduct);

router.get('/categories', getCategories);
router.get('/low-stock', getLowStockProducts);

router
  .route('/:id')
  .get(getProduct)
  .put(authorize('owner', 'admin'), updateProduct)
  .delete(authorize('owner', 'admin'), deleteProduct);

router.put('/:id/stock', authorize('owner', 'admin'), updateStock);

module.exports = router;