import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import ms from 'ms';
import ApiError from '~/utils/ApiError';
import { userModel } from '~/models/userModel';

const createNew = async (req, res, next) => {
    try {
        const createdUser = await userService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdUser);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        // xu ly tra ve http only cookie cho phia trinh duyet
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const result = await userService.googleLogin(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await userService.forgotPassword(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const result = await userService.resetPassword(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const logout = async (req, res, next) => {
    try {
        // Xoa cookie la lam nguoc lai voi gan cookie o login
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(StatusCodes.OK).json({ loggedOut: true });
    } catch (error) {
        next(error);
    }
};
const refreshToken = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req.body.refreshToken);
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh Token)'));
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await userModel.findOneById(req.jwtDecoded._id);
        user.email = user.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;
        const updatedData = req.body;
        const avatar = req.file;
        const updatedUser = await userService.update(userId, updatedData, avatar);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};
export const userController = {
    login,
    createNew,
    googleLogin,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    getUser,
    update,
};
