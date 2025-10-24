import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators';

const CART_COLLECTION_NAME = 'carts';

const CART_COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    totalItems: Joi.number().default(0),
    totalPrice: Joi.number().default(0),
    cartItems: Joi.array().default([]),
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
    return await CART_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};
const addCart = async (data, userId) => {
    try {
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .findOneAndUpdate(
                { userId: userId },
                {
                    $set: {
                        cartItems: data,
                        updatedAt: new Date(),
                    },
                },
            );
    } catch (error) {
        throw new Error(error);
    }
};
const findOneById = async (cartId) => {
    try {
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(cartId) });
    } catch (error) {
        throw new Error(error);
    }
};
const findOneByUserId = async (userId) => {
    try {
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .findOne({ userId: userId });
    } catch (error) {
        throw new Error(error);
    }
};

const getCart = async (userId) => {
    try {
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .findOne({ userId: userId });
    } catch (error) {
        throw new Error(error);
    }
};
const update = async (cartId, updateData) => {
    try {
        // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(cartId) },
                { $set: updateData },
                { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
            );
    } catch (error) {
        throw new Error(error);
    }
};
const deleteCartProduct = async (productId, userId) => {
    try {
        return await GET_DB()
            .collection(CART_COLLECTION_NAME)
            .updateOne({ userId: userId }, { $pull: { cartItems: { _id: productId } } });
    } catch (error) {
        throw new Error(error);
    }
};
export const cartModel = {
    CART_COLLECTION_NAME,
    CART_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    findOneByUserId,
    update,
    addCart,
    getCart,
    deleteCartProduct,
};
