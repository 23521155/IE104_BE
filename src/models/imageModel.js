import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators';

const IMAGE_COLLECTION_NAME = 'images';

const IMAGE_COLLECTION_SCHEMA = Joi.object({
    productId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    url: Joi.string().required(),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null),
    _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];
const validateBeforeCreate = async (data) => {
    return await IMAGE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(IMAGE_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (imageId) => {
    try {
        return await GET_DB()
            .collection(IMAGE_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(imageId) });
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (imageId, updateData) => {
    try {
        // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
        return await GET_DB()
            .collection(IMAGE_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(imageId) },
                { $set: updateData },
                { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
            );
    } catch (error) {
        throw new Error(error);
    }
};

const getProductsImages = async (productType) => {
    try {
        return await GET_DB()
            .collection(IMAGE_COLLECTION_NAME)
            .find()
            .toArray();
    } catch (error) {
        throw new Error(error);
    }
};

const getProductImages = async (productId) => {
    try {
        return await GET_DB()
            .collection(IMAGE_COLLECTION_NAME)
            .find({ productId: productId })
            .toArray();
    } catch (error) {
        throw new Error(error);
    }
};

export const imageModel = {
    IMAGE_COLLECTION_NAME,
    IMAGE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    update,
    getProductsImages,
    getProductImages,
};
