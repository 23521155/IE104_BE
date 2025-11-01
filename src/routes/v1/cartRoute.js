import express from 'express';
import { cartController } from '~/controllers/cartController';

import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/get-cartt').get(authMiddleware.isAuthorized, cartController.getCart);
Router.route('/add-cart').post(authMiddleware.isAuthorized, cartController.addCart);
Router.route('/update').patch(authMiddleware.isAuthorized, cartController.update);
Router.route('/delete-cartProduct/:productId').delete(authMiddleware.isAuthorized, cartController.deleteCartProduct);

export const cartRoute = Router;
