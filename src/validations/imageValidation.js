import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const urlSchema = Joi.string().required();
const productIdSchema = Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE);

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        url: urlSchema,
        productId: productIdSchema,
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};

export const imageValidation = {
    createNew,
};
