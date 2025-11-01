import { cartModel } from '~/models/cartModel';

const addCart = async (reqBody, user) => {
    try {
        const product = reqBody.product;
        const existingCart = await cartModel.findOneByUserId(user._id.toString());
        let flag = 0;
        existingCart.cartItems.forEach((item) => {
            if (item._id.toString() === product._id.toString()) {
                flag = 1;
            }
        });
        existingCart.cartItems.push(product);
        if (flag !== 1) {
            await cartModel.addCart(existingCart.cartItems, user._id);
            return 'This product was added';
        } else return 'This product was already added';
    } catch (error) {
        throw error;
    }
};
const getCart = async (user) => {
    try {
        return await cartModel.getCart(user._id);
    } catch (error) {
        throw error;
    }
};
const deleteCartProduct = async (productId, user) => {
    try {
        return await cartModel.deleteCartProduct(productId, user._id);
    } catch (error) {
        throw error;
    }
};
const update = async (cartId, updateData) => {
    try {
        return await cartModel.update(cartId, updateData);
    } catch (error) {
        throw error;
    }
};
export const cartService = {
    addCart,
    getCart,
    deleteCartProduct,
    update,
};
