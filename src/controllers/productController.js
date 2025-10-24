import { StatusCodes } from 'http-status-codes';
import { productService } from '~/services/productService';

const createNew = async (req, res, next) => {
    try {
        const createdProduct = await productService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const productType = req.params.productType;
        const { page, itemsPerPage, q: queryFilters } = req.query;

        const products = await productService.getProducts(productType, page, itemsPerPage, queryFilters);
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
};

export const productController = {
    createNew,
    getProducts,
};
