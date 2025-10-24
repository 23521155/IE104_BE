import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators';

const PRODUCT_TYPE_COLLECTION_NAME = 'productTypes';

const PRODUCT_TYPE_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),
    productOrderIds: Joi.array()
        .items(
            Joi.string()
                .pattern(OBJECT_ID_RULE)
                .message(OBJECT_ID_RULE_MESSAGE),
        )
        .default([]),
    slug: Joi.string()
        .required()
        .min(3)
        .trim()
        .strict(),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null),
    _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = ['_id', 'name', 'createdAt'];
const validateBeforeCreate = async (data) => {
    return await PRODUCT_TYPE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(PRODUCT_TYPE_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (productTypeId) => {
    try {
        return await GET_DB()
            .collection(PRODUCT_TYPE_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(productTypeId) });
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (productTypeId, updateData) => {
    try {
        // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
        return await GET_DB()
            .collection(PRODUCT_TYPE_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(productTypeId) },
                { $set: updateData },
                { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
            );
    } catch (error) {
        throw new Error(error);
    }
};
export const productTypeModel = {
    PRODUCT_TYPE_COLLECTION_NAME,
    PRODUCT_TYPE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    update,
};
