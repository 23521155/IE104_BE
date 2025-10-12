import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import ms from 'ms';

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
// const logout = async (req, res, next) => {
//     try {
//         // Xoa cookie la lam nguoc lai voi gan cookie o login
//         res.clearCookie('accessToken');
//         res.clearCookie('refreshToken');
//
//         res.status(StatusCodes.OK).json({ loggedOut: true });
//     } catch (error) {
//         next(error);
//     }
// };
export const userController = {
    login,
    createNew,
    googleLogin,
    forgotPassword,
    resetPassword,
    // logout,
};
