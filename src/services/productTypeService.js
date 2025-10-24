import { productTypeModel } from '~/models/productTypeModel';

import { slugify } from '~/utils/formatters';

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

export const productTypeService = {
    createNew,
};
