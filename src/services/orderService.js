import { orderModel } from '~/models/orderModel';

const createNew = async (reqBody) => {
    try {
        const createdOrder = await orderModel.createNew(reqBody);
        return await orderModel.findOneById(createdOrder.insertedId);
    } catch (error) {
        throw error;
    }
};
const getOrders = async (userId) => {
    try {
        return await orderModel.getOrders(userId);
    } catch (error) {
        throw error;
    }
};
export const orderService = {
    createNew,
    getOrders,
};
