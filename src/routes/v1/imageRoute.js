import express from 'express';
import { imageValidation } from '~/validations/imageValidation';
import { imageController } from '~/controllers/imageController';

// import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/').post(imageValidation.createNew, imageController.createNew);

export const imageRoute = Router;
