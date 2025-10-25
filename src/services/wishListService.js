import { wishListModel } from '~/models/wishListModel';

const addWishList = async (reqBody, user) => {
    try {
        const product = reqBody.product;
        const existingWishList = await wishListModel.findOneByUserId(user._id.toString());
        let flag = 0;
        existingWishList.wishListItems.forEach((item) => {
            if (item._id.toString() === product._id.toString()) {
                flag = 1;
            }
        });
        existingWishList.wishListItems.push(product);
        if (flag !== 1) {
            await wishListModel.addWishList(existingWishList.wishListItems, user._id);
            return 'This product was added';
        } else return 'This product was already added';
    } catch (error) {
        throw error;
    }
};
const getWishList = async (user) => {
    try {
        return await wishListModel.getWishList(user._id);
    } catch (error) {
        throw error;
    }
};
const deleteWishListProduct = async (productId, user) => {
    try {
        return await wishListModel.deleteWishListProduct(productId, user._id);
    } catch (error) {
        throw error;
    }
};
export const wishListService = {
    addWishList,
    getWishList,
    deleteWishListProduct,
};
