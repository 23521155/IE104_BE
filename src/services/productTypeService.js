import { productTypeModel } from '~/models/productTypeModel';

import { slugify } from '~/utils/formatters';
import { productModel } from '~/models/productModel';

const createNew = async (reqBody) => {
    try {
        const info = {
            ...reqBody,
            slug: slugify(reqBody.name),
        };
        // thuc hien luu thong tin vao database
        const createdProductType = await productTypeModel.createNew(info);
        return await productTypeModel.findOneById(createdProductType.insertedId);
    } catch (error) {
        throw error;
    }
};
const getProductType = async (query) => {
    try {
        const productTypes = await productTypeModel.getProductType();
        const products = [];
        for (const productType of productTypes) {
            const data = await productModel.getAllProducts(productType.slug);
            products.push(...data);
        }
        if (query) return products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
        else return products;
    } catch (error) {
        throw error;
    }
};

export const productTypeService = {
    createNew,
    getProductType,
};
