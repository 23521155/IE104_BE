import express from 'express';
import { wishListController } from '~/controllers/wishListController';

import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/get-wishList').get(authMiddleware.isAuthorized, wishListController.getWishList);
Router.route('/add-wishList').post(authMiddleware.isAuthorized, wishListController.addWishList);

Router.route('/delete-wishlistProduct/:productId').delete(
    authMiddleware.isAuthorized,
    wishListController.deleteWishListProduct,
);

export const wishListRoute = Router;
