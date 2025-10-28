import { StatusCodes } from 'http-status-codes';
import { productTypeService } from '~/services/productTypeService';

const createNew = async (req, res, next) => {
    try {
        const createdProductType = await productTypeService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdProductType);
    } catch (error) {
        next(error);
    }
};
const getProductType = async (req, res, next) => {
    try {
        const query = req.query.q;
        const createdProductType = await productTypeService.getProductType(query);
        res.status(StatusCodes.OK).json(createdProductType);
    } catch (error) {
        next(error);
    }
};
export const productTypeController = {
    createNew,
    getProductType,
};
