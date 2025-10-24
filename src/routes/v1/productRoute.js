import express from 'express';
import { productValidation } from '~/validations/productValidation';
import { productController } from '~/controllers/productController';
import { imageController } from '~/controllers/imageController';

// import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/').post(productValidation.createNew, productController.createNew);
Router.route('/:productType').get(productController.getProducts);
Router.route('/:productType/image').get(imageController.getProductsImages);
Router.route('/:productType/:id/image').get(imageController.getProductImages);
export const productRoute = Router;
