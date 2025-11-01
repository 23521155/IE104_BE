import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators';

const ORDER_COLLECTION_NAME = 'orders';

const ORDER_COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    totalPrice: Joi.number().default(0),
    status: Joi.string().default('pending'),
    orderItems: Joi.array().default([]),
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
    return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(ORDER_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (orderId) => {
    try {
        return await GET_DB()
            .collection(ORDER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(orderId) });
    } catch (error) {
        throw new Error(error);
    }
};
const findOneByUserId = async (userId) => {
    try {
        return await GET_DB()
            .collection(ORDER_COLLECTION_NAME)
            .findOne({ userId: userId });
    } catch (error) {
        throw new Error(error);
    }
};

const getOrders = async (userId) => {
    try {
        return await GET_DB()
            .collection(ORDER_COLLECTION_NAME)
            .find({ userId: userId })
            .toArray();
    } catch (error) {
        throw new Error(error);
    }
};
const update = async (orderId, updateData) => {
    try {
        // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
        return await GET_DB()
            .collection(ORDER_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(orderId) },
                { $set: updateData },
                { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
            );
    } catch (error) {
        throw new Error(error);
    }
};
export const orderModel = {
    ORDER_COLLECTION_NAME,
    ORDER_COLLECTION_SCHEMA,
    getOrders,
    createNew,
    findOneById,
    findOneByUserId,
    update,
};
