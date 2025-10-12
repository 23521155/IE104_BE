import express from 'express';
import { userRoute } from '~/routes/v1/userRoute';

const Router = express.Router();

// user api
Router.use('/users', userRoute);

//data api
export const APIs_V1 = Router;
