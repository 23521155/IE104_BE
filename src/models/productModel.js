import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators';
import { pagingSkipValue } from '~/utils/algorithms';

// const PRODUCT_COLLECTION_NAME = 'dresses';
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().default(''),
    description: Joi.string(),
    price: Joi.number().required(),
    productTypeName: Joi.string().required(),
    productTypeId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    slug: Joi.string()
        .required()
        .min(3)
        .trim()
        .strict(),
    stockQuantity: Joi.number().required(),
    colorOptions: Joi.array().items(Joi.string()),
    sizes: Joi.array().items(Joi.string()),
    imageOrderIds: Joi.array()
        .items(
            Joi.string()
                .pattern(OBJECT_ID_RULE)
                .message(OBJECT_ID_RULE_MESSAGE),
        )
        .default([]),
    careIntroduction: Joi.string().default(''),
    length: Joi.number(),
    origin: Joi.string().default(''),
    material: Joi.string().default(''),
    brand: Joi.string().default(''),
    wishlistCount: Joi.number().default(0),
    soldCount: Joi.number().default(0),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null),
    _isSale: Joi.boolean().default(false),
    _isBestSeller: Joi.boolean().default(false),
    _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = ['_id', 'name', 'createdAt'];
const validateBeforeCreate = async (data) => {
    return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(validData.productTypeName)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (productId, productTypename) => {
    try {
        return await GET_DB()
            .collection(productTypename)
            .findOne({ _id: new ObjectId(productId) });
    } catch (error) {
        throw new Error(error);
    }
};

const getProducts = async (productType, page, itemsPerPage, queryFilters) => {
    try {
        const queryCondition = [
            // Dk1: Board chua bi xoa
            { _destroy: false },
        ];

        if (queryFilters) {
            Object.keys(queryFilters).forEach((key) => {
                // Co phan biet chu hoa chu thuong
                // queryCondition.push({ [key]: { $regex: queryFilters[key] } });
                // Khong phan biet hoa thuong
                queryCondition.push({ [key]: { $regex: new RegExp(queryFilters[key], 'i') } });
            });
        }

        const query = await GET_DB()
            .collection(productType)
            .aggregate(
                [
                    // 1️⃣ Lọc những sản phẩm không bị xóa
                    { $match: { $and: queryCondition } },

                    {
                        $addFields: {
                            idString: { $toString: '$_id' },
                        },
                    },

                    // 2️⃣ Nối (lookup) qua collection images
                    {
                        $lookup: {
                            from: 'images',
                            localField: 'idString', // product._id
                            foreignField: 'productId', // image.productId
                            as: 'images',
                        },
                    },

                    // 3️⃣ Chỉ giữ lại 2 ảnh đầu tiên của mỗi sản phẩm
                    {
                        $addFields: {
                            images: { $slice: ['$images', 5] },
                        },
                    },

                    { $sort: { name: 1 } },
                    {
                        $facet: {
                            // 1️⃣ Lấy danh sách sản phẩm
                            queryProducts: [{ $skip: pagingSkipValue(page, itemsPerPage) }, { $limit: itemsPerPage }],

                            // 2️⃣ Đếm tổng số sản phẩm
                            queryTotalProducts: [{ $count: 'countedAllProducts' }],
                        },
                    },
                    // 4️⃣ Loại bỏ các trường không cần thiết (tùy bạn)
                    // {
                    //     $project: {
                    //         name: 1,
                    //         price: 1,
                    //         description: 1,
                    //         stockQuantity: 1,
                    //         material: 1,
                    //         length: 1,
                    //         origin: 1,
                    //         images: 1,
                    //     },
                    // },
                ],
                { collation: { locale: 'en' } },
            )
            .toArray();

        const res = query[0];
        return {
            products: res.queryProducts || [],
            totalProducts: res.queryTotalProducts[0]?.countedAllProducts || 0,
        };
    } catch (error) {
        throw new Error(error);
    }
};

//
// const update = async (productId, updateData) => {
//     try {
//         // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
//         Object.keys(updateData).forEach((fieldName) => {
//             if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
//                 delete updateData[fieldName];
//             }
//         });
//
//         // (phần tiếp theo chắc bị cắt, nếu bạn muốn mình hoàn thiện đoạn `update`, hãy gửi thêm)
//         return await GET_DB()
//             .collection(validData.productTypeName)
//             .findOneAndUpdate(
//                 { _id: new ObjectId(productId) },
//                 { $set: updateData },
//                 { returnDocument: 'after' }, // sẽ trả về kết quả mới sau khi cập nhật
//             );
//     } catch (error) {
//         throw new Error(error);
//     }
// };
export const productModel = {
    // PRODUCT_COLLECTION_NAME,
    PRODUCT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getProducts,
    // update,
};
