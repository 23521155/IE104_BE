import { StatusCodes } from 'http-status-codes';
import { cartService } from '~/services/cartService';

const addCart = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;
        const result = await cartService.addCart(req.body, user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const getCart = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;
        // const user = {
        //     _id: '68f92b2a498ee7a4da566821',
        // };
        const result = await cartService.getCart(user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const deleteCartProduct = async (req, res, next) => {
    try {
        const user = req.jwtDecoded;
        const productId = req.params.productId;
        const result = await cartService.deleteCartProduct(productId, user);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        const { cartId, updateData } = req.body;
        const result = await cartService.update(cartId, updateData);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
export const cartController = {
    addCart,
    deleteCartProduct,
    getCart,
    update,
};
