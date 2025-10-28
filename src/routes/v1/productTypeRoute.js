import express from 'express';
import { productTypeValidation } from '~/validations/productTypeValidation';
import { productTypeController } from '~/controllers/productTypeController';

// import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/')
    .post(productTypeValidation.createNew, productTypeController.createNew)
    .get(productTypeController.getProductType);

export const productTypeRoute = Router;
