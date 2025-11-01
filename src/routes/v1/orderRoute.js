import express from 'express';
import { orderValidation } from '~/validations/orderValidation';
import { orderController } from '~/controllers/orderController';

import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/')
    .get(authMiddleware.isAuthorized, orderController.getOrders)
    .post(authMiddleware.isAuthorized, orderValidation.createNew, orderController.createNew);

export const orderRoute = Router;
