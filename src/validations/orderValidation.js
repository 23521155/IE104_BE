import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        userId: Joi.string()
            .required()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE),
        totalPrice: Joi.number().required(),
        orderItems: Joi.array()
            .items(Joi.object())
            .required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};

export const orderValidation = {
    createNew,
};
