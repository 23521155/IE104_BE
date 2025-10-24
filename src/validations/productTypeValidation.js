import Joi from 'joi';

const nameSchema = Joi.string().required();

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: nameSchema,
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};

export const productTypeValidation = {
    createNew,
};
