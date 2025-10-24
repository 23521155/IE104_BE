import { StatusCodes } from 'http-status-codes';
import { imageService } from '~/services/imageService';

const createNew = async (req, res, next) => {
    try {
        const createdImage = await imageService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdImage);
    } catch (error) {
        next(error);
    }
};

const getProductsImages = async (req, res, next) => {
    try {
        const productType = req.params;
        const images = await imageService.getProductsImages(productType);
        res.status(StatusCodes.OK).json(images);
    } catch (error) {
        next(error);
    }
};

const getProductImages = async (req, res, next) => {
    try {
        const { productType, id: productId } = req.params;
        const images = await imageService.getProductImages(productType, productId);
        res.status(StatusCodes.OK).json(images);
    } catch (error) {
        next(error);
    }
};

export const imageController = {
    createNew,
    getProductsImages,
    getProductImages,
};
