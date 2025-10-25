import { userModel } from '~/models/userModel';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatters';
import ApiError from '~/utils/ApiError';
import { env } from '~/config/environment';
import { OAuth2Client } from 'google-auth-library';
import { JwtProvider } from '~/providers/JwtProvider';
import axios from 'axios';
import qs from 'qs';
import nodemailer from 'nodemailer';
import req from 'express/lib/request';
import { cartModel } from '~/models/cartModel';
import { wishListModel } from '~/models/wishlistModel';
const createNew = async (reqBody) => {
    try {
        // kiem tra xem userName da ton tai trong he thong hay chua
        const existUser = await userModel.findOneByEmail(reqBody.email);
        if (existUser) {
            throw new ApiError(400, 'User already exist');
        }
        const username = reqBody.firstName + ' ' + reqBody.lastName;
        // tao data de luu vao database
        const newUser = {
            // tham so thu 2 la do phuc tap cang cao thi cang phuc tap
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            username: username,
            password: bcrypt.hashSync(reqBody.password, 8),
            email: reqBody.email,
            verifyToken: uuidv4(),
        };
        // thuc hien luu thong tin vao database
        const createdUser = await userModel.createNew(newUser);
        const getNewUser = await userModel.findOneById(createdUser.insertedId);
        await cartModel.createNew({ userId: getNewUser._id.toString() });
        await wishListModel.createNew({ userId: getNewUser._id.toString() });
        // return tra ve cho controller
        return pickUser(getNewUser);
    } catch (error) {
        throw error;
    }
};

const login = async (reqBody) => {
    try {
        const existUser = await userModel.findOneByEmail(reqBody.email);
        if (!existUser) {
            throw new ApiError(400, 'User not found');
        }
        if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
            throw new ApiError(400, 'Password does not match');
        }
        // Neu moi thu ok
        // Tao thong tin de dinh kem trong jwt token
        const userInfo = {
            _id: existUser._id,
            userName: existUser.username,
        };
        // Tao ra 2 loai token , accessToken refreshToken
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE,
        );
        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE,
        );
        // Tra va thong tin nguoi dung kem theo 2 token
        return { accessToken, refreshToken, ...pickUser(existUser) };
    } catch (error) {
        throw error;
    }
};

const googleLogin = async (reqBody) => {
    try {
        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
        const code = reqBody.code;
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            qs.stringify({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        );
        const { id_token } = tokenRes.data;
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;
        const emailGoogle = email + `${googleId}`;
        let user = await userModel.findOneByEmailGoogle(emailGoogle);
        if (!user) {
            await userModel.createNewGoogleLogin({
                username: name,
                email: emailGoogle,
                verifyToken: uuidv4(),
                avatar: picture,
            });
            const userAfterCreate = await userModel.findOneByEmail(emailGoogle);
            await cartModel.createNew({ userId: userAfterCreate._id.toString() });
            await wishListModel.createNew({ userId: userAfterCreate._id.toString() });
        }
        const existUser = await userModel.findOneByEmailGoogle(emailGoogle);
        const userInfo = {
            _id: existUser._id,
            userName: existUser.username,
        };
        // Tao ra 2 loai token , accessToken refreshToken
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE,
        );
        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE,
        );
        // Tra va thong tin nguoi dung kem theo 2 token
        return { accessToken, refreshToken, ...pickUser(existUser) };
    } catch (error) {
        throw error;
    }
};

const forgotPassword = async (reqBody) => {
    try {
        const email = reqBody.email;
        // Tìm user
        const exitUser = await userModel.findOneByEmail(email);
        if (!exitUser) {
            throw new ApiError(400, 'Email does not exist');
        }
        // Tạo token reset password (hết hạn sau 15 phút)
        const resetToken = await JwtProvider.generateToken(
            { email: exitUser.email, _id: exitUser._id },
            env.RESET_PASSWORD_SECRET,
            '15m',
        );
        // Tạo link reset
        const resetLink = `localhost:63342/IE104/ResetPassword/ResetPassword.html?token=${resetToken}`;
        // Cấu hình gửi mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USERNAME,
                pass: env.EMAIL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"Support Team" <no-reply@nguyenletuanphi910.2019@gmail.com>',
            to: email,
            subject: 'Đặt lại mật khẩu của bạn',
            html: `
      <p>Xin chào ${exitUser.username || ''},</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào link bên dưới:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link này sẽ hết hạn sau 15 phút.</p>
    `,
        });
        return info;
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (reqBody) => {
    try {
        const { newPassword, token } = reqBody;

        const decodedToken = await JwtProvider.verifyToken(token, env.RESET_PASSWORD_SECRET);

        const email = decodedToken.email;
        const user = await userModel.findOneByEmail(email);

        const newPasswordAfterHash = bcrypt.hashSync(newPassword, 8);

        await userModel.update(user._id.toString(), { password: newPasswordAfterHash });
        return await userModel.findOneByEmail(email);
    } catch (error) {
        throw error;
    }
};
const refreshToken = async (clientRefreshToken) => {
    try {
        // Verify / giải mã cái refresh token xem có hợp lệ không
        const refreshTokenDecoded = await JwtProvider.verifyToken(
            clientRefreshToken,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
        );

        // Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi,
        // vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.
        const userInfo = {
            _id: refreshTokenDecoded._id,
            userName: refreshTokenDecoded.username,
        };

        // Tạo accessToken mới
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            // 5 // 5 giây để test accessToken hết hạn
            env.ACCESS_TOKEN_LIFE, // 1 tiếng
        );

        return { accessToken };
    } catch (error) {
        throw error;
    }
};
export const userService = {
    createNew,
    login,
    googleLogin,
    forgotPassword,
    resetPassword,
    refreshToken,
};
