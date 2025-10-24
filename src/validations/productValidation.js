import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const nameSchema = Joi.string().required();
const titleSchema = Joi.string().default('');
const descriptionSchema = Joi.string();
const priceSchema = Joi.number().required();
const productTypeIdSchema = Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE);
const stockQuantitySchema = Joi.number().required();
const materialSchema = Joi.string();
const originSchema = Joi.string();
const careIntroductionSchema = Joi.string();
const lengthSchema = Joi.number();

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: nameSchema,
        title: titleSchema,
        description: descriptionSchema,
        stockQuantity: stockQuantitySchema,
        price: priceSchema,
        productTypeId: productTypeIdSchema,
        material: materialSchema,
        origin: originSchema,
        careIntroduction: careIntroductionSchema,
        length: lengthSchema,
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};

export const productValidation = {
    createNew,
};
