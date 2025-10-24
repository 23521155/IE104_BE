import { imageModel } from '~/models/imageModel';

const createNew = async (reqBody) => {
    try {
        const createdImage = await imageModel.createNew(reqBody);
        return await imageModel.findOneById(createdImage.insertedId);
    } catch (error) {
        throw error;
    }
};

const getProductsImages = async (productType) => {
    try {
        return await imageModel.getProductsImages(productType);
    } catch (error) {
        throw error;
    }
};

const getProductImages = async (productType, productId) => {
    try {
        return await imageModel.getProductImages(productId);
    } catch (error) {
        throw error;
    }
};

export const imageService = {
    createNew,
    getProductsImages,
    getProductImages,
};
