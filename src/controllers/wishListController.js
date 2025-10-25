import { StatusCodes } from 'http-status-codes';
import { wishListService } from '~/services/wishListService';

const addWishList = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;
        const result = await wishListService.addWishList(req.body, user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const getWishList = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;

        const result = await wishListService.getWishList(user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const deleteWishListProduct = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;
        const productId = req.params.productId;
        const result = await wishListService.deleteWishListProduct(productId, user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
export const wishListController = {
    addWishList,
    deleteWishListProduct,
    getWishList,
};
