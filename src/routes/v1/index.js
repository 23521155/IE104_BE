import express from 'express';
import { userRoute } from '~/routes/v1/userRoute';
import { productTypeRoute } from '~/routes/v1/productTypeRoute';
import { productRoute } from '~/routes/v1/productRoute';
import { imageRoute } from '~/routes/v1/imageRoute';
import { cartRoute } from '~/routes/v1/cartRoute';
import { wishListRoute } from '~/routes/v1/wishListRoute';
import { orderRoute } from '~/routes/v1/orderRoute';

const Router = express.Router();

// user api
Router.use('/users', userRoute);
// production api
Router.use('/productType', productTypeRoute);
Router.use('/product', productRoute);
Router.use('/image', imageRoute);
//cart api
Router.use('/cart', cartRoute);
//wishlist api
Router.use('/wishlist', wishListRoute);
//order api
Router.use('/order', orderRoute);
export const APIs_V1 = Router;
