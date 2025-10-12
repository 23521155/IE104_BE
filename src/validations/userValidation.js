import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators';

export const firstNameSchema = Joi.string().required();
export const lastNameSchema = Joi.string().required();
export const emailSchema = Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE);
export const passwordSchema = Joi.string()
    .required()
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE);

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        firstName: firstNameSchema,
        lastName: lastNameSchema,
        email: emailSchema,
        password: passwordSchema,
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};

const login = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: emailSchema,
        password: passwordSchema,
    });
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};
const forgotPassword = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: emailSchema,
    });
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};
const resetPassword = async (req, res, next) => {
    const correctCondition = Joi.object({
        newPassword: passwordSchema,
        token: Joi.string().required(),
    });
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        throw error;
    }
};
export const userValidation = {
    login,
    createNew,
    forgotPassword,
    resetPassword,
};
