import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PHONE_RULE, PHONE_RULE_MESSAGE } from '~/utils/validators';
// Define tạm 2 roles cho user, tùy việc mở rộng dự án như thế nào mà mọi người có thể thêm role tùy ý sao cho phù hợp sau.
const USER_ROLES = {
    CLIENT: 'client',
    ADMIN: 'admin',
};

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
        .required()
        .pattern(EMAIL_RULE)
        .message(EMAIL_RULE_MESSAGE), // unique
    password: Joi.string().required(),
    username: Joi.string()
        .required()
        .trim()
        .strict(), // unique
    avatar: Joi.string().default(null),
    role: Joi.string()
        .valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN)
        .default(USER_ROLES.CLIENT),
    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    phoneNumber: Joi.string()
        .pattern(PHONE_RULE)
        .message(PHONE_RULE_MESSAGE)
        .default(''),
    address: Joi.string().default(''),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null),
    _destroy: Joi.boolean().default(false),
});
const USER_GOOGLE_LOGIN_COLLECTION_SCHEMA = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string()
        .required()
        .pattern(EMAIL_RULE)
        .message(EMAIL_RULE_MESSAGE), // unique
    password: Joi.string(),
    username: Joi.string()
        .required()
        .trim()
        .strict(), // unique
    avatar: Joi.string().default(null),
    role: Joi.string()
        .valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN)
        .default(USER_ROLES.CLIENT),
    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null),
    _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'userName', 'createdAt'];

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeCreateGoogleLogin = async (data) => {
    return await USER_GOOGLE_LOGIN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};
const createNewGoogleLogin = async (data) => {
    try {
        const validData = await validateBeforeCreateGoogleLogin(data);
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};
const findOneById = async (userId) => {
    try {
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(userId) });
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByUserName = async (userName) => {
    try {
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ username: userName });
    } catch (error) {
        throw new Error(error);
    }
};
const findOneByEmail = async (email) => {
    try {
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ email: email });
    } catch (error) {
        throw new Error(error);
    }
};
const findOneByEmailGoogle = async (email) => {
    try {
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ email: email });
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (userId, updateData) => {
    try {
        // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: updateData },
                { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
            );
    } catch (error) {
        throw new Error(error);
    }
};

export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    USER_ROLES,
    createNew,
    createNewGoogleLogin,
    findOneById,
    findOneByUserName,
    findOneByEmail,
    findOneByEmailGoogle,
    update,
};
