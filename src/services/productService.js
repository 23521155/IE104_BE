import { productModel } from '~/models/productModel';
import { slugify } from '~/utils/formatters';
import { productTypeModel } from '~/models/productTypeModel';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';

const createNew = async (reqBody) => {
    try {
        const productType = await productTypeModel.findOneById(reqBody.productTypeId);
        const info = {
            ...reqBody,
            productTypeName: productType.slug,
            slug: slugify(reqBody.name),
        };
        // thuc hien luu thong tin vao database
        const createdProduct = await productModel.createNew(info);
        return await productModel.findOneById(createdProduct.insertedId, productType.slug);
    } catch (error) {
        throw error;
    }
};

const getProducts = async (productType, page, itemsPerPage, queryFilters) => {
    try {
        if (!page) page = DEFAULT_PAGE;
        if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
        return await productModel.getProducts(
            productType,
            parseInt(page, 10),
            parseInt(itemsPerPage, 10),
            queryFilters,
        );
    } catch (error) {
        throw error;
    }
};

export const productService = {
    createNew,
    getProducts,
};
