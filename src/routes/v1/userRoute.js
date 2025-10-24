import express from 'express';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

// import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/register').post(userValidation.createNew, userController.createNew);

Router.route('/login').post(userValidation.login, userController.login);
Router.route('/google-login').post(userController.googleLogin);
Router.route('/forgot-password').post(userValidation.forgotPassword, userController.forgotPassword);
Router.route('/reset-password').post(userValidation.resetPassword, userController.resetPassword);
Router.route('/refresh_token').post(userController.refreshToken);
Router.route('/logout').delete(userController.logout);
export const userRoute = Router;
