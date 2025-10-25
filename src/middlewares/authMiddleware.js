import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { JwtProvider } from '~/providers/JwtProvider';
import { env } from '~/config/environment';

const isAuthorized = async (req, res, next) => {
    // Lay accessToken nam trong req cookies phia client-withCredentials trong file authorizeAxios
    const clientAccessToken = req.headers.authorization?.replace('Bearer ', '');
    // Neu nhu clientAccessToken khong ton tai
    if (!clientAccessToken) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access'));
        return;
    }
    try {
        // Thuc hien giai ma token xem no co hop le hay la ko
        const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE);

        // Luu thong tin giai ma vao req de cac tang khac xu ly
        req.jwtDecoded = accessTokenDecoded;

        // Cho phep req di tiep
        next();
    } catch (error) {
        // console.log('🔥 Error trong verifyToken:', error?.message);
        // console.log('🔥 Full error:', error);
        // Neu accessToken het han (expired) thi tra ve ma GONE - 410 de FE goi api refreshToken
        if (error?.message?.includes('jwt expired')) {
            next(new ApiError(StatusCodes.GONE, 'need to refresh token'));
            return;
        }
        // Neu nhu cai accessToken no co nhung loi khac thi tra ve 401 de FE goi sign out
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access'));
    }
};

export const authMiddleware = {
    isAuthorized,
};
