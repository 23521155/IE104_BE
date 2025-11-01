import { StatusCodes } from 'http-status-codes';
import { orderService } from '~/services/orderService';

const createNew = async (req, res, next) => {
    try {
        const createdOrder = await orderService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdOrder);
    } catch (error) {
        next(error);
    }
};
const getOrders = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;
        const orders = await orderService.getOrders(userId);
        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        next(error);
    }
};
// const getProductsOrders = async (req, res, next) => {
//     try {
//         const productType = req.params;
//         const orders = await orderService.getProductsOrders(productType);
//         res.status(StatusCodes.OK).json(orders);
//     } catch (error) {
//         next(error);
//     }
// };
//
// const getProductOrders = async (req, res, next) => {
//     try {
//         const { productType, id: productId } = req.params;
//         const orders = await orderService.getProductOrders(productType, productId);
//         res.status(StatusCodes.OK).json(orders);
//     } catch (error) {
//         next(error);
//     }
// };

export const orderController = {
    createNew,
    getOrders,
    // getProductsOrders,
    // getProductOrders,
};
